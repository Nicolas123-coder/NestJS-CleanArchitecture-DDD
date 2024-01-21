import { UserEntity } from '../entities/user.entity'
import {
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResult,
  SearchableRepositoryInterface,
} from '@/shared/domain/repositories/searchable-repository-contracts'

// [INFO] O uso do namespace é para evitar conflito de nomes, e para podermos sobrescrever
// a classe SearchParams e SearchResult, caso necessário
export namespace UserRepository {
  export type Filter = string

  export class SearchParams extends DefaultSearchParams<Filter> {}
  export class SearchResult extends DefaultSearchResult<UserEntity, Filter> {}

  export interface Repository
    extends SearchableRepositoryInterface<
      UserEntity,
      Filter,
      SearchParams,
      SearchResult
    > {
    findByEmail(id: string): Promise<UserEntity>
    emailExists(email: string): Promise<void>
  }
}
