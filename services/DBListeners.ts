import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentChange,
  DocumentData,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { dbClient } from "./FirebaseClient";
import { BlistyRoom, FBMessage, OAIMessage } from "./serviceTypes";
import { getResponse } from "./AIChat";
import { match } from "./PsicoMatch";

const activeListeners = new Map<string, () => void>();

const initDBListener = async (): Promise<void> => {
  const roomsRef = collection(dbClient, "rooms");
  const roomsQuery = query(
    roomsRef,
    where("userIds", "array-contains", "blisty"),
    orderBy("createdAt", "desc")
  );
  onSnapshot(
    roomsQuery,
    async (roomsSnap) => {
      roomsSnap.docChanges().forEach(async (roomsChange) => {
        const roomId = roomsChange.doc.id;
        const userId = getUserIdFromRoom(roomsChange.doc.data() as BlistyRoom);
        if (roomsChange.type === "added") {
          console.log(`Room with id ${roomId} was added`);
          if (!activeListeners.has(roomId)) {
            setupMessagesListener(roomId, userId);
          }
        } else if (roomsChange.type === "modified") {
          console.log(`Room with id ${roomId} was modified`);
        } else if (roomsChange.type === "removed") {
          console.log(`Room with id ${roomId} was removed`);
          const unsubscribe = activeListeners.get(roomId);
          if (unsubscribe) {
            unsubscribe();
            activeListeners.delete(roomId);
          }
        }
      });
    },
    (error) => {
      console.error("Error getting rooms", error);
    }
  );
};

const getUserIdFromRoom = (room: BlistyRoom): string => {
  return room.userIds.find((userId) => userId !== "blisty") ?? "";
};

const setupMessagesListener = async (roomId: string, userId: string) => {
  const messageRef = collection(dbClient, `rooms/${roomId}/messages`);
  const messageQuery = query(messageRef, orderBy("createdAt", "asc"));
  const unsubscribe = onSnapshot(
    messageQuery,
    async (messageSnap) => {
      messageSnap.docChanges().forEach(async (messageChange) => {
        const message = messageChange.doc.data() as DocumentData;
        if ((message as FBMessage).type === "refresh_notification") {
          clearRoom(roomId);
        } else {
          if (messageChange.type === "added" && fromUser(messageChange)) {
            console.log(`Mensaje de usuario en sala ${roomId}`);
            const historyMessages: Array<OAIMessage> = messageSnap.docs.map(
              (doc) => {
                return FBMessageToOAIMessage(doc.data() as FBMessage);
              }
            );
            const response = await getResponse(historyMessages, userId);
            const newMessage = OAIMessageToFBMessage(response.message, userId);
            const roomsRef = collection(dbClient, "rooms");
            const roomRef = doc(roomsRef, roomId);
            if (response.endChat) {
              const room = await getDoc(roomRef);
              const tags = room.data()?.tags ?? [];
              const mTags = room.data()?.mTags ?? [];
              const newTags = tags.concat(response.tags);
              const newMTags = mTags.concat(response.mTags);
              const uids = await match(newTags, newMTags);
              newMessage.psicoUids = uids.slice(0, 2);
              newMessage.type = "ia_suggestion";
            }
            await updateDoc(roomRef, {
              tags: response.tags,
              mTags: response.mTags,
              end: response.endChat,
            });
            addDoc(
              collection(dbClient, `rooms/${roomId}/messages`),
              newMessage
            );
          } else if (messageChange.type === "modified") {
            console.log(`Message with id ${message.id} was modified`);
          } else if (messageChange.type === "removed") {
            console.log(`Message with id ${message.id} was removed`);
          }
        }
      });
    },
    (error) => {
      console.error("Error getting messages", error);
    }
  );
  activeListeners.set(roomId, unsubscribe);
};

const fromUser = (change: DocumentChange<DocumentData>): boolean => {
  const message = change.doc.data() as FBMessage;
  return message.from !== "blisty";
};

const FBMessageToOAIMessage = (message: FBMessage): OAIMessage => {
  const role = message.from === "blisty" ? "assistant" : "user";
  return {
    role,
    content: message.text,
  };
};

const clearRoom = async (roomId: string) => {
  const messagesRef = collection(dbClient, `rooms/${roomId}/messages`);
  const messages = await getDocs(messagesRef);
  const deletePromises = messages.docs.map((doc) => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
};

const OAIMessageToFBMessage = (
  message: OAIMessage,
  userId: string
): FBMessage => {
  return {
    createdAt: new Date(),
    from: message.role === "assistant" ? "blisty" : userId,
    text: message.content as string,
    to: message.role === "assistant" ? userId : "blisty",
    type: "contact",
  };
};

export { initDBListener };
