import { MasterTag, Tag } from "../types/repositories";

export interface TagsRepository {
  getTags: () => Promise<Tag[]>;
  getMasterTags: () => Promise<MasterTag[]>;
  addTag: (tag: Tag) => Promise<void>;
  addMasterTag: (tag: MasterTag) => Promise<void>;
  deleteTag: (tag: Tag) => Promise<void>;
  deleteMasterTag: (tag: MasterTag) => Promise<void>;
  updateTag: (tag: Tag) => Promise<void>;
  updateMasterTag: (tag: MasterTag) => Promise<void>;
}
