import { PrismaClient, User } from '@prisma/client'
import { UserModelMapper } from '../../user-model.mapper'
import { ValidationError } from '@/shared/domain/errors/validation-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'

// !!! Não rodar os testes com o comando da extensão de test runner,
// Rodar com o comando no terminal: npm run test:int -- user-model.mapper !!!
describe('UserModelMapper integration tests', () => {
  let prismaService: PrismaClient
  let props: any

  beforeAll(async () => {
    // Comando para criar o banco de dados de ambiente de teste
    setupPrismaTests()

    prismaService = new PrismaClient()
    await prismaService.$connect()
  })

  beforeEach(async () => {
    await prismaService.user.deleteMany()

    props = {
      id: '4cf010a2-8a10-4f1a-9e4e-50e6ec0c5e24',
      name: 'John Doe',
      email: 'test@test.com',
      password: '1234',
      createdAt: new Date(),
    }
  })

  afterAll(async () => {
    await prismaService.$disconnect()
  })

  it('should throws error when user model is invalid', async () => {
    const model: User = Object.assign(props, { name: null })

    expect(() => UserModelMapper.toEntity(model)).toThrow(ValidationError)
  })

  it('should convert a user model to a user entity', async () => {
    const model: User = await prismaService.user.create({
      data: props,
    })

    const sut = UserModelMapper.toEntity(model)

    expect(sut).toBeInstanceOf(UserEntity)
    expect(sut.toJSON()).toStrictEqual(props)
  })
})
