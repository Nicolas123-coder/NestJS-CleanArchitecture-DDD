import { UserRepository } from '@/users/domain/repository/user.repository'
import { UserOutput, UserOutputMapper } from '../dtos/user-output'
import { Usecase as AbstractUsecase } from '@/shared/application/usecases/usecase'
import { BadRequestError } from '@/shared/application/errors/bad-request-error'

export namespace GetUserUseCase {
  export type Input = {
    id: string
    name: string
  }

  export type Output = UserOutput

  export class UseCase implements AbstractUsecase<Input, Output> {
    constructor(private userRepository: UserRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      if (!input.name) {
        throw new BadRequestError('Name not provided')
      }

      const entity = await this.userRepository.findById(input.id)
      entity.update(input.name)
      await this.userRepository.update(entity)

      return UserOutputMapper.toOutput(entity)
    }
  }
}
