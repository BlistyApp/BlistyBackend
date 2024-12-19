import { Psychologist } from "@src/types/service";

export interface PsycoRepository {
  getPsycologists: () => Promise<Psychologist[]>;
  addPsychologist: (psychologist: Psychologist) => Promise<void>;
}
