import { SearchResult } from '@/shared/domain/repositories/searchable-repository-contracts'
import { PaginationOutputMapper } from '../../pagination-output'

describe('PaginationOutputMappter unit tests', () => {
  it('Should convert a SearchResult in Output', () => {
    const result = new SearchResult({
      items: ['test'] as any,
      total: 1,
      currentPage: 1,
      perPage: 1,
      sort: null,
      sortDir: null,
      filter: 'test',
    })

    const sut = PaginationOutputMapper.toOutput(result.items, result)

    expect(sut).toStrictEqual({
      items: ['test'] as any,
      total: 1,
      currentPage: 1,
      perPage: 1,
      lastPage: 1,
    })
  })
})
