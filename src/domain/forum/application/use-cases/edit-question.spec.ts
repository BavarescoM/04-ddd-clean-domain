import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'
import { makeQuestion } from '@/test/factories/make-question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { EditQuestionUseCase } from './edit-question'
import { NotAllowedError } from './errors/not-allowed-error'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: EditQuestionUseCase

describe('Edit Question', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new EditQuestionUseCase(inMemoryQuestionsRepository)
  })
  it('should be able to Edit a question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('question-1'),
    )
    await inMemoryQuestionsRepository.create(newQuestion)
    await sut.execute({
      authorId: 'author-1',
      content: 'Pergunta teste',
      title: 'Conteúdo teste',
      questionId: newQuestion.id.toValue(),
    })
    expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
      content: 'Pergunta teste',
      title: 'Conteúdo teste',
    })
  })
  it('should not be able to Edit a questions from another user', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('question-1'),
    )
    await inMemoryQuestionsRepository.create(newQuestion)
    const result = await sut.execute({
      questionId: newQuestion.id.toValue(),
      authorId: 'author-2',
      title: 'Pergunta teste',
      content: 'Conteúdo teste',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
