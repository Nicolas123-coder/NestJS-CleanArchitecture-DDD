import { UserRepository } from '@/users/domain/repository/user.repository'
import { Usecase as AbstractUsecase } from '@/shared/application/usecases/usecase'

export namespace DeleteUserUseCase {
  export type Input = {
    id: string
  }

  export type Output = void

  export class UseCase implements AbstractUsecase<Input, Output> {
    constructor(private userRepository: UserRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      await this.userRepository.delete(input.id)
    }
  }
}
