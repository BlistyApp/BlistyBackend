import RepositoryFactory from "@src/services/repo-factory";

export const match = async (
  tags: Array<string>,
  mTags: Array<string>
): Promise<Array<string>> => {
  const repo = RepositoryFactory.getPsycoRepository("firebase");
  const psychologists = await repo.getPsycologists();
  psychologists.forEach((psychologist) => {
    let matchIndex = 0;
    psychologist.tags.forEach((tag) => {
      if (tags.includes(tag)) {
        matchIndex += 1;
      }
    });
    psychologist.mTags.forEach((tag) => {
      if (mTags.includes(tag)) {
        matchIndex += 2;
      }
    });
    psychologist.matchIndex = matchIndex;
  });
  psychologists.sort((a, b) => b.matchIndex - a.matchIndex);
  return psychologists.map((psychologist) => psychologist.id);
};
