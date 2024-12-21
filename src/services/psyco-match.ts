import RepositoryFactory from "../services/repo-factory";

export const match = async (
  tags: Array<string>,
  mTags: Array<string>
): Promise<Array<string>> => {
  const psycoRepo = RepositoryFactory.getPsycoRepository("firebase");
  const tagsRepo = RepositoryFactory.getTagsRepository("firebase");
  const matchMap = new Map<string, number>();
  const repoTags = await tagsRepo.getTags();
  const repoMTags = await tagsRepo.getMasterTags();
  repoTags.filter((tag) => tags.includes(tag.id));
  repoMTags.filter((mTag) => mTags.includes(mTag.id));
  repoTags.forEach((tag) => {
    if (!matchMap.has(tag.masterTag)) {
      matchMap.set(tag.masterTag, 0);
    } else {
      matchMap.set(tag.masterTag, matchMap.get(tag.id)! + 1);
    }
  });
  const bestMTag = Array.from(matchMap.entries()).reduce((a, b) =>
    a[1] > b[1] ? a : b
  );
  let bestMTags = [...mTags, bestMTag[0]];
  bestMTags = Array.from(new Set(bestMTags));
  let bestTags = [...tags];
  bestTags = Array.from(new Set(bestTags));
  const psycologists = await psycoRepo.getPsycologists();
  const scores: Array<{ id: string; score: number }> = [];
  psycologists.forEach((psyco) => {
    let score = 0;
    psyco.mTags.forEach((mTag) => {
      if (bestMTags.includes(mTag)) {
        score += 2;
      }
    });
    psyco.tags.forEach((tag) => {
      if (bestTags.includes(tag)) {
        score += 1;
      }
    });
    scores.push({ id: psyco.id, score });
  });
  scores.sort((a, b) => b.score - a.score);
  return scores.map((score) => score.id).slice(0, 3);
};
