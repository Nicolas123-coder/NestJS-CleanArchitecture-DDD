import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repository/user-in-memory.repository'
import { SignupUseCase } from '../../signup.usecase'
import { HashProvider } from '@/shared/application/providers/hash-provider'
import { BcryptJsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcrypt-hash.provider'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { ConflictError } from '@/shared/domain/errors/conflict-error'
import { BadRequestError } from '@/users/application/errors/bad-request-error'

describe('SignupUseCase unit tests', () => {
  let sut: SignupUseCase.UseCase
  let repository: UserInMemoryRepository
  let hashProvider: HashProvider

  beforeEach(() => {
    repository = new UserInMemoryRepository()
    hashProvider = new BcryptJsHashProvider()

    sut = new SignupUseCase.UseCase(repository, hashProvider)
  })

  it('Should create a User', async () => {
    const spyInsert = jest.spyOn(repository, 'insert')
    const props = UserDataBuilder({})

    const result = await sut.execute({
      name: props.name,
      email: props.email,
      password: props.password,
    })

    expect(result.id).toBeDefined()
    expect(result.createdAt).toBeInstanceOf(Date)
    expect(spyInsert).toHaveBeenCalledTimes(1)
  })

  it('Should not create user with a used email', async () => {
    const props = UserDataBuilder({ email: 'test@test.com' })
    await sut.execute(props)

    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(ConflictError)
  })

  it('Should throws error when name not provided', async () => {
    const props = Object.assign(UserDataBuilder({}), { name: null })

    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    )
  })

  it('Should throws error when email not provided', async () => {
    const props = Object.assign(UserDataBuilder({}), { email: null })

    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    )
  })

  it('Should throws error when password not provided', async () => {
    const props = Object.assign(UserDataBuilder({}), { password: null })

    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    )
  })
})
