import { DatabaseListener } from "../interfaces/database-listener";
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
  updateDoc,
  where,
} from "firebase/firestore";
import { dbClient } from "../config/firebase-client";
import logger from "../utils/logger";
import { FBMessage, OAIMessage, Room } from "../types/service";
import { getResponse } from "../services/ai-chat";
import { match } from "../services/psyco-match";
import { updateSystemPrompt } from "src/config/openai";

class FirebaseListener implements DatabaseListener {
  private activeListeners = new Map<string, () => void>();
  async initDBListeners(): Promise<void> {
    const roomsQuery = query(
      collection(dbClient, "rooms"),
      where("userIds", "array-contains", "blisty"),
      orderBy("createdAt", "desc")
    );
    onSnapshot(roomsQuery, this.roomListener.bind(this), (error) => {
      logger.error("Error setting up room listener", error.message);
    });
    const systemQuery = query(collection(dbClient, "system"), limit(1));
    onSnapshot(systemQuery, this.systemListener.bind(this), (error) => {
      logger.error("Error setting up system listener", error.message);
    });
    const tagsQuery = query(collection(dbClient, "tags"));
    onSnapshot(tagsQuery, this.tagsListener.bind(this), (error) => {
      logger.error("Error setting up tags listener", error.message);
    });
    const mTagsQuery = query(collection(dbClient, "mTags"));
    onSnapshot(mTagsQuery, this.mTagsListener.bind(this), (error) => {
      logger.error("Error setting up mTags listener", error.message);
    });
  }

  async systemListener(
    systemSnap: QuerySnapshot<DocumentData, DocumentData>
  ): Promise<void> {
    for (const systemChange of systemSnap.docChanges()) {
      if (systemChange.type === "modified") {
        logger.info("Modified system prompt");
        await updateSystemPrompt();
      }
    }
  }

  async tagsListener(
    tagsSnap: QuerySnapshot<DocumentData, DocumentData>
  ): Promise<void> {
    for (const tagsChange of tagsSnap.docChanges()) {
      if (tagsChange.type === "modified" || tagsChange.type === "added") {
        logger.info("Modified tags");
        await updateSystemPrompt();
      }
    }
  }

  async mTagsListener(
    mTagsSnap: QuerySnapshot<DocumentData, DocumentData>
  ): Promise<void> {
    for (const mTagsChange of mTagsSnap.docChanges()) {
      if (mTagsChange.type === "modified" || mTagsChange.type === "added") {
        logger.info("Modified mTags");
        await updateSystemPrompt();
      }
    }
  }

  async roomListener(
    roomsSnap: QuerySnapshot<DocumentData, DocumentData>
  ): Promise<void> {
    for (const roomsChange of roomsSnap.docChanges()) {
      const room = roomsChange.doc.data() as Room;
      const roomId = room.roomId;

      if (roomsChange.type === "added") {
        logger.info(`Added room : ${roomId}`);
        if (!this.activeListeners.has(roomId)) {
          await this.setupMessagesListener(roomId);
        }
      } else if (roomsChange.type === "removed") {
        logger.info(`Removed room : ${roomId}`);
        const listener = this.activeListeners.get(roomId);
        if (listener) {
          listener();
          this.activeListeners.delete(roomId);
        }
      }
    }
  }
  async setupMessagesListener(roomId: string): Promise<void> {
    const messagesQuery = query(
      collection(dbClient, "rooms", roomId, "messages"),
      orderBy("createdAt", "asc")
    );
    const listener = onSnapshot(
      messagesQuery,
      this.messagesListener.bind(this),
      (error) => {
        logger.error("Error setting up messages listener", error.message);
      }
    );
    this.activeListeners.set(roomId, listener);
  }

  async messagesListener(
    messagesSnap: QuerySnapshot<DocumentData, DocumentData>
  ): Promise<void> {
    messagesSnap.docChanges().forEach(async (messagesChange) => {
      const message = messagesChange.doc.data() as FBMessage;
      message.id = messagesChange.doc.id;
      const userId = message.to === "blisty" ? message.from : message.to;
      const roomId = this.getRoomId(userId);
      if (message.type === "refresh_notification") {
        logger.info(`Refresh notification : ${message.id}`);
        return;
      }
      if (
        messagesChange.type === "added" &&
        this.fromUser(message) &&
        !message.responded
      ) {
        logger.info(`Added user message : ${message.id}`);
        const lastRefresh = await this.getLastRefresh(roomId);
        const history = await this.getHistory(messagesSnap, lastRefresh);
        await this.processMessage(history, userId, roomId);
        await updateDoc(
          doc(dbClient, "rooms", roomId, "messages", message.id),
          {
            responded: true,
          }
        );
      } else if (messagesChange.type === "added") {
        logger.info(`Added message : ${message.id}`);
      } else if (messagesChange.type === "modified") {
        logger.info(`Modified message : ${message.id}`);
      } else if (messagesChange.type === "removed") {
        logger.info(`Removed message : ${message.id}`);
      }
    });
  }

  getRoomId(userId: string): string {
    return [userId, "blisty"].sort().join("-");
  }

  async getLastRefresh(roomId: string): Promise<Date> {
    const roomRef = doc(dbClient, "rooms", roomId);
    const room = (await getDoc(roomRef)).data() as Room;
    return room.last_refresh;
  }

  async getHistory(
    messageSnap: QuerySnapshot<DocumentData, DocumentData>,
    lastRefresh: Date
  ): Promise<Array<OAIMessage>> {
    const history: Array<OAIMessage> = [];
    messageSnap.docs.forEach((message) => {
      const msg = message.data() as FBMessage;
      if (msg.createdAt > lastRefresh) {
        history.push(this.FBMessageToOAIMessage(msg));
      }
    });
    return history;
  }

  fromUser(messageChange: FBMessage): boolean {
    return messageChange.from !== "blisty";
  }

  FBMessageToOAIMessage(message: FBMessage): OAIMessage {
    const role = message.from === "blisty" ? "assistant" : "user";
    const content = message.text;
    if (role === "assistant") {
      return {
        role,
        content,
        aiResponse: message.aiResponse ?? "",
      };
    }
    return { role, content };
  }

  OAIMessageToFBMessage(message: OAIMessage, userId: string): FBMessage {
    const from = message.role === "assistant" ? "blisty" : userId;
    const to = message.role === "assistant" ? userId : "blisty";
    const text = message.content as string;
    const type = "contact";
    const createdAt = new Date();
    if (message.role === "assistant") {
      return {
        createdAt,
        from,
        to,
        text,
        type,
        aiResponse: message.aiResponse ?? "",
      };
    }
    return { createdAt, from, to, text, type };
  }

  async processMessage(
    history: Array<OAIMessage>,
    userId: string,
    roomId: string
  ): Promise<void> {
    const response = await getResponse(history, userId);
    const newMessage = this.OAIMessageToFBMessage(response.content, userId);
    const roomRef = doc(dbClient, "rooms", roomId);
    const room = (await getDoc(roomRef)).data() as Room;
    if (response.end) {
      const tags = room.tags ?? [];
      const mTags = room.mTags ?? [];
      tags.push(...response.tags);
      mTags.push(...response.mTags);
      const psycoUids = await match(tags, mTags);
      newMessage.psicoUids = psycoUids.slice(0, 3);
      newMessage.type = "ia_suggestion";
    }
    await updateDoc(roomRef, {
      tags: response.tags,
      mTags: response.mTags,
      end: response.end,
    });
    await addDoc(collection(dbClient, `rooms/${roomId}/messages`), newMessage);
  }
}
export default FirebaseListener;
