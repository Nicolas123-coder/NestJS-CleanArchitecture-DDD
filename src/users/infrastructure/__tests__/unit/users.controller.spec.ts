import { SignupUseCase } from '@/users/application/usecases/signUp.usecase'
import { UsersController } from '../../users.controller'
import { UserOutput } from '@/users/application/dtos/user-output'
import { SignUpDto } from '../../dtos/signUp.dto'

describe('UsersController unit tests', () => {
  let sut: UsersController
  let id: string
  let props: UserOutput

  beforeEach(async () => {
    sut = new UsersController()
    id = '4cf010a2-8a10-4f1a-9e4e-50e6ec0c5e24'
    props = {
      id: id,
      name: 'John Doe',
      email: 'test@test.com',
      password: '1234',
      createdAt: new Date(),
    }
  })

  it('Controller should be defined', () => {
    expect(sut).toBeDefined()
  })

  it('Should create a User', async () => {
    const output: SignupUseCase.Output = props

    const mockSignUpUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }

    sut['signUpUseCase'] = mockSignUpUseCase as any

    const input: SignUpDto = {
      name: 'John Doe',
      email: 'test@test.com',
      password: '1234',
    }

    const result = sut.create(input)
    expect(output).toMatchObject(result)
    expect(mockSignUpUseCase.execute).toHaveBeenCalledWith(input)
  })
})
