import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repository/user-in-memory.repository'
import { GetUserUseCase } from '../../getuser.usecase'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'

describe('GetUserUseCase unit tests', () => {
  let sut: GetUserUseCase.UseCase
  let repository: UserInMemoryRepository

  beforeEach(() => {
    repository = new UserInMemoryRepository()

    sut = new GetUserUseCase.UseCase(repository)
  })

  it('Should throw error when User not found', async () => {
    await expect(() => sut.execute({ id: 'invalidId' })).rejects.toBeInstanceOf(
      NotFoundError,
    )
  })

  it('Should get an User when id exists', async () => {
    const spyFindById = jest.spyOn(repository, 'findById')
    const items = [new UserEntity(UserDataBuilder({}))]

    repository.items = items

    const result = await sut.execute({ id: items[0].id })

    expect(spyFindById).toHaveBeenCalledTimes(1)
    expect(result).toEqual(items[0].toJSON())
  })
})
