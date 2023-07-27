import { Answer } from "../entities/anwser"
import { AnwserReposiory } from "../repositories/anwser-repository"

interface AnswerQuestionUseCaseRequest {
  instructorId: string
  questionId: string
  content: string
}

export class AnswerQuestionUseCase {

  constructor(private anwserRespository: AnwserReposiory) {
  }

  async execute({instructorId, questionId, content}: AnswerQuestionUseCaseRequest) {
    const answer = new Answer({
      content,
      authorId: instructorId,
      questionId
    })
    await this.anwserRespository.create(answer)
    return answer
  }
}
