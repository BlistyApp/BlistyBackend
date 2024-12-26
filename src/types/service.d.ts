import { Timestamp } from "firebase-admin/firestore";

export type FirebaseCredentials = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

export type Room = {
  createdAt: Timestamp;
  end: boolean;
  userIds: string[];
  users: Array<User>;
  tags?: Array<string>;
  mTags?: Array<string>;
  roomId: string;
  last_refresh: Timestamp;
};

export type FBMessage = {
  createdAt: Timestamp;
  from: string;
  text: string;
  to: string;
  type: "refresh_notification" | "contact" | "ia_suggestion";
  psicoUids?: string[];
  id?: string;
  responded?: boolean;
  aiResponse?: string;
};

export interface OAIMessage {
  role: "assistant" | "user" | "system";
  content: Array<object> | string;
  aiResponse?: string;
}

export interface AIServiceResponse {
  tags: Array<string>;
  mTags: Array<string>;
  end: boolean;
  content: OAIMessage;
}

export interface AIResponse {
  tags: Array<string>;
  mTags: Array<string>;
  end: boolean;
  content: string;
}

export interface Psychologist {
  id: string;
  tags: Array<string>;
  mTags: Array<string>;
  name: string;
}

export interface AIPrompt {
  role: string;
  description: string;
  objectives: Array<string>;
  conversation_guidelines: {
    tone: {
      style: string;
      avoid: Array<string>;
    };
    questions: {
      approach: string;
      examples: Array<string>;
    };
    format: {
      structure: string;
      examples: Array<string>;
    };
  };
  message_structure: {
    content: {
      type: string; //"string",
      description: string; // "Contenido del mensaje"
    };
    tags: {
      type: string; // "array",
      description: string; // "Etiquetas asignadas a la conversación",
      dictionary: Array<string>;
    };
    mTags: {
      type: string; // "array",
      description: string; // "Etiquetas de derivación profesional asignadas a la conversación",
      dictionary: Array<string>;
    };
    end: {
      type: string;
      description: string; //"Si la conversación finaliza, debes colocar este apartado en true",
    };
  };
  steps_of_interaction: [
    {
      step: string;
      description: string;
    }
  ];
  user_info: {
    name: string;
  };
}
