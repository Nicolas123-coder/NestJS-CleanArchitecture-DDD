import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repository/user-in-memory.repository'
import { UpdatePasswordUseCase } from '../../updatePassword.usecase'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { HashProvider } from '@/shared/application/providers/hash-provider'
import { BcryptJsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcrypt-hash.provider'
import { InvalidPasswordError } from '@/shared/application/errors/invalid-password-error'

describe('UpdatePasswordUseCase unit tests', () => {
  let sut: UpdatePasswordUseCase.UseCase
  let repository: UserInMemoryRepository
  let hashProvider: HashProvider

  beforeEach(() => {
    repository = new UserInMemoryRepository()
    hashProvider = new BcryptJsHashProvider()

    sut = new UpdatePasswordUseCase.UseCase(repository, hashProvider)
  })

  it('Should throw error when User not found', async () => {
    await expect(() =>
      sut.execute({
        id: 'invalidId',
        password: 'test',
        oldPassword: 'oldTest',
      }),
    ).rejects.toBeInstanceOf(NotFoundError)
  })

  it('Should throw error when old password is missing', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    repository.items = [entity]

    await expect(() =>
      sut.execute({
        id: entity._id,
        password: 'test',
        oldPassword: '',
      }),
    ).rejects.toBeInstanceOf(InvalidPasswordError)
  })

  it('Should throw error when new password is missing', async () => {
    const entity = new UserEntity(UserDataBuilder({ password: 'test' }))
    repository.items = [entity]

    await expect(() =>
      sut.execute({
        id: entity._id,
        password: '',
        oldPassword: 'test',
      }),
    ).rejects.toBeInstanceOf(InvalidPasswordError)
  })

  it('Should throw error when new old password is invalid', async () => {
    const hashPassword = await hashProvider.generateHash('test')

    const entity = new UserEntity(UserDataBuilder({ password: hashPassword }))
    repository.items = [entity]

    await expect(() =>
      sut.execute({
        id: entity._id,
        password: 'test2',
        oldPassword: 'test123',
      }),
    ).rejects.toThrow(new InvalidPasswordError('Invalid Old Password'))
  })

  it('Should update a password', async () => {
    const hashPassword = await hashProvider.generateHash('1234')
    const spyUpdate = jest.spyOn(repository, 'update')
    const items = [new UserEntity(UserDataBuilder({ password: hashPassword }))]
    repository.items = items

    const result = await sut.execute({
      id: items[0]._id,
      password: '4567',
      oldPassword: '1234',
    })

    const checkNewPassword = await hashProvider.compareHash(
      '4567',
      result.password,
    )
    expect(spyUpdate).toHaveBeenCalledTimes(1)
    expect(checkNewPassword).toBeTruthy()
  })
})
