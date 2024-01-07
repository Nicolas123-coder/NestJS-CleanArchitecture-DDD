import { SearchParams } from '../../searchable-repository-contracts'

describe('Searchable Repository unit tests', () => {
  describe('Search Params class tests', () => {
    it('page prop', () => {
      const sut = new SearchParams()
      expect(sut.page).toBe(1)

      const params = [
        { page: null as any, expected: 1 },
        { page: undefined as any, expected: 1 },
        { page: '' as any, expected: 1 },
        { page: 'test' as any, expected: 1 },
        { page: 0, expected: 1 },
        { page: -1, expected: 1 },
        { page: 5.5, expected: 1 },
        { page: true, expected: 1 },
        { page: false, expected: 1 },
        { page: {}, expected: 1 },
        { page: 1, expected: 1 },
        { page: 2, expected: 2 },
      ]

      params.forEach(item => {
        expect(new SearchParams({ page: item.page }).page).toEqual(
          item.expected,
        )
      })
    })

    it('perPage prop', () => {
      const sut = new SearchParams()
      expect(sut.perPage).toBe(15)

      const params = [
        { perPage: null as any, expected: 15 },
        { perPage: undefined as any, expected: 15 },
        { perPage: '' as any, expected: 15 },
        { perPage: 'test' as any, expected: 15 },
        { perPage: 0, expected: 15 },
        { perPage: -1, expected: 15 },
        { perPage: 5.5, expected: 15 },
        { perPage: true, expected: 15 },
        { perPage: false, expected: 15 },
        { perPage: {}, expected: 15 },
        { perPage: 2, expected: 2 },
        { perPage: 25, expected: 25 },
      ]

      params.forEach(item => {
        expect(new SearchParams({ perPage: item.perPage }).perPage).toEqual(
          item.expected,
        )
      })
    })

    it('sortBy prop', () => {
      const sut = new SearchParams()
      expect(sut.sortBy).toBeNull()

      const params = [
        { sortBy: null as any, expected: null },
        { sortBy: undefined as any, expected: null },
        { sortBy: '' as any, expected: null },
        { sortBy: 'test', expected: 'test' },
        { sortBy: 0, expected: '0' },
        { sortBy: -1, expected: '-1' },
        { sortBy: 5, expected: '5' },
        { sortBy: true, expected: 'true' },
        { sortBy: false, expected: 'false' },
        { sortBy: {}, expected: '[object Object]' },
      ]

      params.forEach(item => {
        expect(new SearchParams({ sortBy: item.sortBy }).sortBy).toEqual(
          item.expected,
        )
      })
    })

    it('sortDir prop', () => {
      let sut = new SearchParams()
      expect(sut.sortDir).toBeNull()

      sut = new SearchParams({ sortBy: null })
      expect(sut.sortDir).toBeNull()

      sut = new SearchParams({ sortBy: undefined })
      expect(sut.sortDir).toBeNull()

      sut = new SearchParams({ sortBy: '' })
      expect(sut.sortDir).toBeNull()

      const params = [
        { sortDir: null as any, expected: 'desc' },
        { sortDir: undefined as any, expected: 'desc' },
        { sortDir: '' as any, expected: 'desc' },
        { sortDir: 'test', expected: 'desc' },
        { sortDir: 0, expected: 'desc' },
        { sortDir: 'asc', expected: 'asc' },
        { sortDir: 'desc', expected: 'desc' },
        { sortDir: 'ASC', expected: 'asc' },
        { sortDir: 'DESC', expected: 'desc' },
      ]

      params.forEach(i => {
        expect(
          new SearchParams({ sortBy: 'field', sortDir: i.sortDir }).sortDir,
        ).toBe(i.expected)
      })
    })

    it('filter prop', () => {
      const sut = new SearchParams()
      expect(sut.filter).toBeNull()

      const params = [
        { filter: null as any, expected: null },
        { filter: undefined as any, expected: null },
        { filter: '' as any, expected: null },
        { filter: 'test', expected: 'test' },
        { filter: 0, expected: '0' },
        { filter: -1, expected: '-1' },
        { filter: 5.5, expected: '5.5' },
        { filter: true, expected: 'true' },
        { filter: false, expected: 'false' },
        { filter: {}, expected: '[object Object]' },
        { filter: 1, expected: '1' },
        { filter: 2, expected: '2' },
        { filter: 25, expected: '25' },
      ]

      params.forEach(i => {
        expect(new SearchParams({ filter: i.filter }).filter).toBe(i.expected)
      })
    })
  })
})
