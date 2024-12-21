import { ChatCompletionMessageParam } from "openai/resources";
import { dbAdmin } from "../config/firebase-admin";
import { openai, systemPrompt } from "../config/openai";
import { AIResponse, AIServiceResponse, OAIMessage } from "../types/service";
import logger from "src/utils/logger";

const getResponse = async (
  history: Array<OAIMessage>,
  userId: string
): Promise<AIServiceResponse> => {
  const name =
    (await getName(userId)) ?? "Indefinido, omitir nombre de usuario";
  const aiMessages = Array<OAIMessage>();
  const sys = systemPrompt;
  sys.user_info.name = name;
  aiMessages.push({
    role: "system",
    content: JSON.stringify(sys),
    aiResponse: "",
  });
  history.forEach((message) => {
    if (message.aiResponse) {
      aiMessages.push({
        role: message.role,
        content: message.aiResponse,
        aiResponse: "",
      });
    } else {
      aiMessages.push(message);
    }
  });
  let newMessage: OAIMessage = {
    role: "assistant",
    content: "",
    aiResponse: "",
  };
  let end = false;
  let tags = Array<string>();
  let mTags = Array<string>();
  try {
    const apiResponse = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL ?? "",
      messages: aiMessages as ChatCompletionMessageParam[],
    });
    for (const mBlock of apiResponse.choices) {
      const role = mBlock.message.role;
      if (!mBlock.message.content) {
        continue;
      }
      const content = (await JSON.parse(mBlock.message.content)) as AIResponse;
      newMessage = {
        role,
        content: content.content,
        aiResponse: mBlock.message.content,
      };
      tags = content.tags;
      mTags = content.mTags;
      end = content.end;
    }
  } catch (e) {
    logger.error(`Error en la solicitud de OpenAI: ${e}`);
    newMessage.content = "Lo siento, no puedo responder en este momento";
    end = true;
  }
  return { tags, mTags, end, content: newMessage };
};

const getName = async (userId: string) => {
  const user = await dbAdmin.collection("users").doc(userId).get();
  return user.data()?.name;
};

export { getResponse };
