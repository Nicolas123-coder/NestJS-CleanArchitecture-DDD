import { UserRepository } from '@/users/domain/repository/user.repository'
import { UserOutput, UserOutputMapper } from '../dtos/user-output'
import { Usecase as AbstractUsecase } from '@/shared/application/usecases/usecase'
import { SearchInput } from '@/shared/application/dtos/search-input'
import {
  PaginationOutput,
  PaginationOutputMapper,
} from '@/shared/application/dtos/pagination-output'

export namespace ListUsersUseCase {
  export type Input = SearchInput

  export type Output = PaginationOutput<UserOutput>

  export class UseCase implements AbstractUsecase<Input, Output> {
    constructor(private userRepository: UserRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const searchParams = new UserRepository.SearchParams(input)
      const searchResult = await this.userRepository.search(searchParams)

      return this.toOutput(searchResult)
    }

    private toOutput(searchResult: UserRepository.SearchResult): Output {
      const items = searchResult.items.map(item => {
        return UserOutputMapper.toOutput(item)
      })

      return PaginationOutputMapper.toOutput(items, searchResult)
    }
  }
}
