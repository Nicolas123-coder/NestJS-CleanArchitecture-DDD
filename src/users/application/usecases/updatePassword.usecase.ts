import { UserRepository } from '@/users/domain/repository/user.repository'
import { UserOutput, UserOutputMapper } from '../dtos/user-output'
import { Usecase as AbstractUsecase } from '@/shared/application/usecases/usecase'
import { InvalidPasswordError } from '@/shared/application/errors/invalid-password-error'
import { HashProvider } from '@/shared/application/providers/hash-provider'

export namespace UpdatePasswordUseCase {
  export type Input = {
    id: string
    password: string
    oldPassword: string
  }

  export type Output = UserOutput

  export class UseCase implements AbstractUsecase<Input, Output> {
    constructor(
      private userRepository: UserRepository.Repository,
      private hashProvider: HashProvider,
    ) {}

    async execute(input: Input): Promise<Output> {
      const entity = await this.userRepository.findById(input.id)

      if (!input.password || !input.oldPassword) {
        throw new InvalidPasswordError('New and Old Password are required')
      }

      const checkOldPassword = await this.hashProvider.compareHash(
        input.oldPassword,
        entity.password,
      )

      if (!checkOldPassword) {
        throw new InvalidPasswordError('Invalid Old Password')
      }

      const newPasswordHash = await this.hashProvider.generateHash(
        input.password,
      )

      entity.updatePassword(newPasswordHash)
      console.log(entity)

      await this.userRepository.update(entity)

      return UserOutputMapper.toOutput(entity)
    }
  }
}
