import { ChatCompletionMessageParam } from "openai/resources";
import { dbAdmin } from "../config/firebase-admin";
import { openai, systemPrompt } from "../config/openai";
import { AIResponse, OAIMessage } from "../types/service";

const getResponse = async (
  history: Array<OAIMessage>,
  userId: string
): Promise<AIResponse> => {
  const name =
    (await getName(userId)) ?? "Indefinido, omitir nombre de usuario";
  const aiMessages = Array<OAIMessage>();
  const sys = systemPrompt + ", Saluda por su nombre usuario: " + name;
  aiMessages.push({ role: "system", content: sys });
  history.forEach((message) => {
    aiMessages.push(message);
  });
  let newMessage: OAIMessage = { role: "assistant", content: "" };
  let tags: Array<string> = [];
  let mTags: Array<string> = [];
  let endChat = false;
  try {
    const apiResponse = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL ?? "",
      messages: aiMessages as ChatCompletionMessageParam[],
    });
    for (const mBlock of apiResponse.choices) {
      const role = mBlock.message.role;
      let content = mBlock.message.content ?? "";
      const tagsMatch = content?.match(/<Tags>\[(.*?)\]<\/Tags>/);
      const masterTagsMatch = content?.match(/<MTags><\/MTags>/);
      const endChatMatch = content?.match(/<End-Chat-Blisty>/);
      if (tagsMatch) {
        tags = tagsMatch[1].split(", ").map((tag) => tag.trim());
      }
      if (masterTagsMatch) {
        mTags = masterTagsMatch[1].split(", ").map((tag) => tag.trim());
      }
      if (endChatMatch) {
        endChat = true;
      }
      content = content?.replace(/<Tags>\[(.*?)\]<\/Tags>/, "");
      content = content?.replace(/<MTags>\[(.*?)\]<\/MTags>/, "");
      content = content?.replace(/<End-Chat-Blisty>/, "");
      content = content.trim();
      newMessage = { role: role, content: content };
    }
  } catch (e) {
    console.log(e);
  }
  return { tags, mTags, endChat, message: newMessage };
};

const getName = async (userId: string) => {
  const user = await dbAdmin.collection("users").doc(userId).get();
  return user.data()?.name;
};

export { getResponse };
