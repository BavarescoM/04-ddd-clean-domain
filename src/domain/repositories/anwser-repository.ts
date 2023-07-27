import { Answer } from "../entities/anwser";

export interface AnwserReposiory {
  create(anwser: Answer): Promise<void>
}
