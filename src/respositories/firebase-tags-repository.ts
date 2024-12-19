import { dbAdmin } from "../config/firebase-admin";
import { TagsRepository } from "../interfaces/tags-repository";
import { MasterTag, Tag } from "../types/repositories";

export class FirebaseTagsRepository implements TagsRepository {
  private db = dbAdmin;
  async getTags(): Promise<Tag[]> {
    const tags: Tag[] = [];
    const tagsRef = this.db.collection("tags");
    return tagsRef.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        tags.push(doc.data() as Tag);
      });
      return tags;
    });
  }
  async getMasterTags(): Promise<MasterTag[]> {
    const masterTags: MasterTag[] = [];
    const masterTagsRef = this.db.collection("master-tags");
    return masterTagsRef.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        masterTags.push(doc.data() as MasterTag);
      });
      return masterTags;
    });
  }
  async addTag(tag: Tag): Promise<void> {
    const tagsRef = this.db.collection("tags");
    await tagsRef.add(tag);
  }
  async addMasterTag(tag: MasterTag): Promise<void> {
    const masterTagsRef = this.db.collection("master-tags");
    await masterTagsRef.add(tag);
  }
  async deleteTag(tag: Tag): Promise<void> {
    const tagsRef = this.db.collection("tags");
    await tagsRef.doc(tag.id ?? tag.tag).delete();
  }
  async deleteMasterTag(tag: MasterTag): Promise<void> {
    const masterTagsRef = this.db.collection("master-tags");
    await masterTagsRef.doc(tag.id ?? tag.tag).delete();
  }
  async updateTag(tag: Tag): Promise<void> {
    const tagsRef = this.db.collection("tags");
    await tagsRef.doc(tag.id ?? tag.tag).update(tag);
  }
  async updateMasterTag(tag: MasterTag): Promise<void> {
    const masterTagsRef = this.db.collection("master-tags");
    await masterTagsRef.doc(tag.id ?? tag.tag).update(tag);
  }
}
