import { SignupUseCase } from '@/users/application/usecases/signUp.usecase'
import { UsersController } from '../../users.controller'
import { UserOutput } from '@/users/application/dtos/user-output'
import { SignUpDto } from '../../dtos/signUp.dto'
import { SignInUseCase } from '@/users/application/usecases/signIn.usecase'
import { SignInDto } from '../../dtos/signIn.dto'
import { UpdateUserUseCase } from '@/users/application/usecases/updateUser.usecase'
import { UpdateUserDto } from '../../dtos/updateUser.dto'
import { UpdatePasswordUseCase } from '@/users/application/usecases/updatePassword.usecase'
import { UpdatePasswordDto } from '../../dtos/updatePassword.dto'
import { GetUserUseCase } from '@/users/application/usecases/getUser.usecase'
import { ListUsersUseCase } from '@/users/application/usecases/listUsers.usecase'

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

  it('Should authenticate a user', async () => {
    const output: SignInUseCase.Output = props
    const mockSigninUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }

    sut['signInUseCase'] = mockSigninUseCase as any

    const input: SignInDto = {
      email: 'a@a.com',
      password: '1234',
    }

    const result = await sut.login(input)
    expect(output).toMatchObject(result)
    expect(mockSigninUseCase.execute).toHaveBeenCalledWith(input)
  })

  it('Should update a user', async () => {
    const output: UpdateUserUseCase.Output = props
    const mockUpdateUserUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }

    sut['updateUserUseCase'] = mockUpdateUserUseCase as any

    const input: UpdateUserDto = {
      name: 'John Doe',
    }

    const result = await sut.update(id, input)
    expect(output).toMatchObject(result)
    expect(mockUpdateUserUseCase.execute).toHaveBeenCalledWith({ id, ...input })
  })

  it('Should update a user password', async () => {
    const output = undefined
    const mockDeleteUserUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }

    sut['deleteUserUseCase'] = mockDeleteUserUseCase as any

    const result = await sut.delete(id)
    expect(output).toStrictEqual(result)
    expect(mockDeleteUserUseCase.execute).toHaveBeenCalledWith({
      id,
    })
  })

  it('Should find a specific user', async () => {
    const output: GetUserUseCase.Output = props
    const mockGetUserUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }

    sut['getUserUseCase'] = mockGetUserUseCase as any

    const result = await sut.findOne(id)
    expect(output).toStrictEqual(result)
    expect(mockGetUserUseCase.execute).toHaveBeenCalledWith({
      id,
    })
  })

  it('Should list users', async () => {
    const output: ListUsersUseCase.Output = {
      items: [props],
      currentPage: 1,
      lastPage: 1,
      perPage: 1,
      total: 1,
    }

    const mockListUsersUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }

    sut['listUsersUseCase'] = mockListUsersUseCase as any
    const searchParams = {
      page: 1,
      perPage: 1,
    }

    const result = await sut.search(searchParams)
    expect(output).toStrictEqual(result)
    expect(mockListUsersUseCase.execute).toHaveBeenCalledWith(searchParams)
  })
})
