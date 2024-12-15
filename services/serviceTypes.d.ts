export interface FirebaseCredentials {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface BlistyRoom {
  createdAt: Date;
  end: boolean;
  roomId: string;
  userIds: string[];
  users: Array<User>;
  tags?: Array<string>;
  mTags?: Array<string>;
}

export interface User {
  name: string;
  profilePic?: string;
  userId: string;
}

export interface FBMessage {
  createdAt: Date;
  from: string;
  text: string;
  to: string;
  type: string;
  psicoUids?: string[];
}

export interface OAIMessage {
  role: string;
  content: Array<object> | string;
}

export interface AIResponse {
  tags: Array<string>;
  mTags: Array<string>;
  endChat: boolean;
  message: OAIMessage;
}

export interface Psychologist {
  uid: string;
  tags: Array<string>;
  mTags: Array<string>;
  matchIndex: number;
}
