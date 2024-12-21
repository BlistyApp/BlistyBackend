import adminTypes from "firebase-admin/firestore";
import clienTypes from "firebase/firestore";

export type RepoType = "firebase";

export type Timestamp = adminTypes.Timestamp | clienTypes.Timestamp;

export type MasterTag = {
  createdAt: Timestamp;
  label: string;
  id: string;
};

export type Tag = {
  createdAt: Timestamp;
  label: string;
  masterTag: string;
  id: string;
};
