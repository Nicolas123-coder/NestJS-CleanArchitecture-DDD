import { UserRepository } from '@/users/domain/repository/user.repository'
import { UserOutput, UserOutputMapper } from '../dtos/user-output'
import { Usecase as AbstractUsecase } from '@/shared/application/usecases/usecase'

export namespace GetUserUseCase {
  export type Input = {
    id: string
  }

  export type Output = UserOutput

  export class UseCase implements AbstractUsecase<Input, Output> {
    constructor(private userRepository: UserRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const entity = await this.userRepository.findById(input.id)

      return UserOutputMapper.toOutput(entity)
    }
  }
}
