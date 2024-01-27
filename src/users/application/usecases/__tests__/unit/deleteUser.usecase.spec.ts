import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repository/user-in-memory.repository'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { DeleteUserUseCase } from '../../deleteUser.uscase'

describe('DeleteUserUseCase unit tests', () => {
  let sut: DeleteUserUseCase.UseCase
  let repository: UserInMemoryRepository

  beforeEach(() => {
    repository = new UserInMemoryRepository()

    sut = new DeleteUserUseCase.UseCase(repository)
  })

  it('Should throw error when User not found', async () => {
    await expect(() => sut.execute({ id: 'invalidId' })).rejects.toBeInstanceOf(
      NotFoundError,
    )
  })

  it('Should delete an User', async () => {
    const spyDelete = jest.spyOn(repository, 'delete')
    const items = [new UserEntity(UserDataBuilder({}))]

    repository.items = items

    await sut.execute({ id: items[0].id })

    expect(spyDelete).toHaveBeenCalledTimes(1)
    expect(repository.items).toHaveLength(0)
  })
})
