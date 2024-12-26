import { dbAdmin } from "src/config/firebase-admin";
import { FBMessage, OAIMessage, Room } from "src/types/service";
import logger from "src/utils/logger";
import { getResponse } from "./ai-chat";
import { match } from "./psyco-match";

const generateResponse = async (
  roomId: string,
  userId: string
): Promise<boolean> => {
  const roomDoc = await dbAdmin.collection("rooms").doc(roomId).get();
  if (!roomDoc.exists) {
    return false;
  }
  const room = roomDoc.data() as Room;
  const messagesDocs = await dbAdmin
    .collection("rooms")
    .doc(roomId)
    .collection("messages")
    .orderBy("createdAt", "asc")
    .get();
  const messages = messagesDocs.docs.map((doc) => {
    let msg = doc.data() as FBMessage;
    msg.id = doc.id;
    return msg;
  });
  const last_message = messages[messages.length - 1];
  if (last_message.type == "refresh_notification") {
    logger.info(`Refresh notification : ${last_message.id}`);
    return true;
  }
  if (!last_message.responded) {
    const history = await getHistory(messages, room.last_refresh);
    const newMessage = await processMessage(history, userId, room);
    await dbAdmin
      .collection("rooms")
      .doc(roomId)
      .collection("messages")
      .doc(last_message.id!)
      .update({ responded: true });
    newMessage.createdAt = new Date();
    await dbAdmin.collection("rooms").doc(roomId).collection("messages").add(newMessage);
    return true;
  }
  return false;
};

const processMessage = async (
  history: Array<OAIMessage>,
  userId: string,
  roomData: Room
) => {
  const response = await getResponse(history, userId);
  const newMessage = OAIMessageToFBMessage(response.content, userId);
  if (response.end) {
    const tags = roomData.tags ?? [];
    const mTags = roomData.mTags ?? [];
    tags.push(...response.tags);
    mTags.push(...response.mTags);
    const psycoUids = await match(tags, mTags);
    newMessage.psicoUids = psycoUids.slice(0, 3);
    newMessage.type = "ia_suggestion";
  }
  await dbAdmin.collection("rooms").doc(roomData.roomId).update({
    tags: response.tags,
    mTags: response.mTags,
    end: response.end
  });
  return newMessage;
};

const getHistory = async (messages: Array<FBMessage>, lastRefresh: Date) => {
  const history: Array<OAIMessage> = [];
  messages.forEach((message) => {
    if (message.createdAt > lastRefresh) {
      history.push(FBMessageToOAIMessage(message));
    }
  });
  return history;
};


const OAIMessageToFBMessage = (
  message: OAIMessage,
  userId: string
): FBMessage => {
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
};

const FBMessageToOAIMessage = (message: FBMessage): OAIMessage => {
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
};

export { generateResponse };