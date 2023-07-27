import { expect, test } from "vitest"
import { AnswerQuestionUseCase } from "./answer-question"
import { AnwserReposiory } from "../repositories/anwser-repository"
import { Answer } from "../entities/anwser"

const fakeAnswersRepository: AnwserReposiory = {
  create: async (anwser: Answer)=>{
    return
  }
}

test('create an answer', async () => {
  const answerQuestion = new AnswerQuestionUseCase(fakeAnswersRepository)

  const answer = await answerQuestion.execute({
    questionId: '1',
    instructorId: '1',
    content: 'Nova resposta',
  })

  expect(answer.content).toEqual('Nova resposta')
})
