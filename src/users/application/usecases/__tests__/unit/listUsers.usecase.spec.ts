import { UserInMemoryRepository } from "@/users/infrastructure/database/in-memory/repository/user-in-memory.repository"
import { ListUsersUseCase } from "../../listUsers.usecase"
import { UserRepository } from "@/users/domain/repository/user.repository"
import { UserEntity } from "@/users/domain/entities/user.entity"
import { UserDataBuilder } from "@/users/domain/testing/helpers/user-data-builder"

describe('ListUsersUseCase unit tests', () => {
  let sut: ListUsersUseCase.UseCase
  let repository: UserInMemoryRepository

  beforeEach(() => {
    repository = new UserInMemoryRepository()

    sut = new ListUsersUseCase.UseCase(repository)
  })

  it('toOutput method', () => {
    let result = new UserRepository.SearchResult({
      items: [] as any,
      total: 1,
      currentPage: 1,
      perPage: 2,
      sort: null,
      sortDir: null,
      filter: null,
    })

    let output = sut['toOutput'](result)

    expect(output).toStrictEqual({
      items: [],
      total: 1,
      currentPage: 1,
      perPage: 2,
      lastPage: 1,
    })

    const entity = new UserEntity(UserDataBuilder({}))
    result = new UserRepository.SearchResult({
      items: [entity] as any,
      total: 1,
      currentPage: 1,
      perPage: 2,
      sort: null,
      sortDir: null,
      filter: null,
    })

    output = sut['toOutput'](result)

    expect(output).toStrictEqual({
      items: [entity.toJSON()],
      total: 1,
      currentPage: 1,
      perPage: 2,
      lastPage: 1,
    })
  })
})
