import { UserRepository } from '@/users/domain/repository/user.repository'
import { UserOutput } from '../dtos/user-output'
import { Usecase as AbstractUsecase } from '@/shared/application/usecases/usecase'
import { SearchInput } from '@/shared/application/dtos/search-input'

export namespace GetUserUseCase {
  export type Input = SearchInput

  export type Output = void

  export class UseCase implements AbstractUsecase<Input, Output> {
    constructor(private userRepository: UserRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const searchParams = new UserRepository.SearchParams(input)
      const searchResult = await this.userRepository.search(searchParams)

      return
    }
  }
}
