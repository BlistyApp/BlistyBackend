import adminTypes from "firebase-admin/firestore";
import clienTypes from "firebase/firestore";

export type RepoType = "firebase";

export type Timestamp = adminTypes.Timestamp | clienTypes.Timestamp;

export type MasterTag = {
  createdAt: Timestamp;
  label: string;
  tag: string;
  id?: string;
};

export type Tag = {
  createdAt: Timestamp;
  label: string;
  tag: string;
  id?: string;
};

export type SystemPrompt = {
  prompt: string;
  id?: string;
};
