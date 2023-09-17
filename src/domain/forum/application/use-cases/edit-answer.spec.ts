import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository'
import { makeAnswer } from '@/test/factories/make-answer'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { EditAnswerUseCase } from './edit-answer'
import { NotAllowedError } from './errors/not-allowed-error'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: EditAnswerUseCase

describe('Edit Answer', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new EditAnswerUseCase(inMemoryAnswersRepository)
  })
  it('should be able to Edit a answer', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('answer-1'),
    )
    await inMemoryAnswersRepository.create(newAnswer)
    await sut.execute({
      authorId: 'author-1',
      content: 'Pergunta teste',
      answerId: newAnswer.id.toValue(),
    })
    expect(inMemoryAnswersRepository.items[0]).toMatchObject({
      content: 'Pergunta teste',
    })
  })
  it('should not be able to Edit a answers from another user', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('answer-1'),
    )
    await inMemoryAnswersRepository.create(newAnswer)
    const result = await sut.execute({
      answerId: newAnswer.id.toValue(),
      authorId: 'author-2',
      content: 'Conteúdo teste',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
