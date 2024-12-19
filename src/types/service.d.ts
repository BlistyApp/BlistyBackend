export type FirebaseCredentials = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

export type Room = {
  createdAt: Date;
  end: boolean;
  userIds: string[];
  users: Array<User>;
  tags?: Array<string>;
  mTags?: Array<string>;
  roomId: string;
  last_refresh: Date;
};

export type FBMessage = {
  createdAt: Date;
  from: string;
  text: string;
  to: string;
  type: "refresh_notification" | "contact" | "ia_suggestion";
  psicoUids?: string[];
  id?: string;
  responded?: boolean;
};

export interface OAIMessage {
  role: "assistant" | "user" | "system";
  content: Array<object> | string;
}

export interface AIResponse {
  tags: Array<string>;
  mTags: Array<string>;
  endChat: boolean;
  message: OAIMessage;
}

export interface Psychologist {
  id: string;
  tags: Array<string>;
  mTags: Array<string>;
  matchIndex: number;
}
