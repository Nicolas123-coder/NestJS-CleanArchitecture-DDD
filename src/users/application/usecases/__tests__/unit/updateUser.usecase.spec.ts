import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repository/user-in-memory.repository'
import { UpdateUserUseCase } from '../../updateUser.usecase'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { BadRequestError } from '@/shared/application/errors/bad-request-error'
import { EntityValidationError } from '@/shared/domain/errors/validation-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'

describe('UpdateUserUseCase unit tests', () => {
  let sut: UpdateUserUseCase.UseCase
  let repository: UserInMemoryRepository

  beforeEach(() => {
    repository = new UserInMemoryRepository()

    sut = new UpdateUserUseCase.UseCase(repository)
  })

  it('Should throw error when User not found', async () => {
    await expect(() =>
      sut.execute({ id: 'invalidId', name: 'test' }),
    ).rejects.toBeInstanceOf(NotFoundError)
  })

  it('Should throw error when name is missing', async () => {
    await expect(() =>
      sut.execute({ id: 'invalidId', name: '' }),
    ).rejects.toBeInstanceOf(BadRequestError)
  })

  it('Should update a User', async () => {
    const spyUpdate = jest.spyOn(repository, 'update')
    const items = [new UserEntity(UserDataBuilder({}))]

    repository.items = items

    const result = await sut.execute({ id: items[0]._id, name: 'new name' })

    expect(spyUpdate).toHaveBeenCalledTimes(1)
    expect(result).toEqual(items[0].toJSON())
  })
})
