import { UserRepository } from '@/users/domain/repository/user.repository'
import { BadRequestError } from '../../../shared/application/errors/bad-request-error'
import { HashProvider } from '@/shared/application/providers/hash-provider'
import { UserOutput, UserOutputMapper } from '../dtos/user-output'
import { Usecase as AbstractUsecase } from '@/shared/application/usecases/usecase'
import { InvalidPasswordError } from '@/shared/application/errors/invalid-password-error'

export namespace SignInUseCase {
  export type Input = {
    email: string
    password: string
  }

  export type Output = UserOutput

  export class UseCase implements AbstractUsecase<Input, Output> {
    constructor(
      private userRepository: UserRepository.Repository,
      private hashProvider: HashProvider,
    ) {}

    async execute(input: Input): Promise<Output> {
      const { email, password } = input

      if (!email || !password) {
        throw new BadRequestError('Input data not provided')
      }

      const entity = await this.userRepository.findByEmail(email)

      const hashPasswordMatches = await this.hashProvider.compareHash(
        password,
        entity.password,
      )

      if (!hashPasswordMatches) {
        throw new InvalidPasswordError('Invalid password')
      }

      return UserOutputMapper.toOutput(entity)
    }
  }
}
