import { SortDirection } from '@/shared/domain/repositories/searchable-repository-contracts'

export type SearchInput<Filter = string> = {
  page?: number
  perPage?: number
  sortBy?: string | null
  sortDir?: SortDirection | null
  filter?: Filter | null
}
