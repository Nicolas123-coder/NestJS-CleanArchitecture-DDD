import { Entity } from '@/shared/domain/entities/entity'
import { InMemorySearchableRepository } from '../../in-memory-searchable.repository'
import {
  SearchParams,
  SearchResult,
} from '../../searchable-repository-contracts'

type StubEntityProps = {
  name: string
  price: number
}

class StubEntity extends Entity<StubEntityProps> {}

class StubInMemorySearchableRepository extends InMemorySearchableRepository<StubEntity> {
  sortableFields: string[] = ['name']

  protected async applyFilter(
    items: StubEntity[],
    filter: string | null,
  ): Promise<StubEntity[]> {
    if (!filter) {
      return items
    }

    return items.filter(item =>
      item.props.name.toLowerCase().includes(filter.toLowerCase()),
    )
  }
}

describe('InMemoryRepository unit tests', () => {
  let sut: StubInMemorySearchableRepository

  beforeEach(() => {
    sut = new StubInMemorySearchableRepository()
  })

  describe('applyFilter method', () => {
    it('Should no filter items when filter param is null', async () => {
      const items = [new StubEntity({ name: 'any_name', price: 1 })]
      const spyFilterMethod = jest.spyOn(items, 'filter')
      const itemsFiltered = await sut['applyFilter'](items, null)

      expect(itemsFiltered).toStrictEqual(items)
      expect(spyFilterMethod).not.toHaveBeenCalled()
    })

    it('Should filter items using filter param', async () => {
      const items = [
        new StubEntity({ name: 'fake', price: 1 }),
        new StubEntity({ name: 'test', price: 1 }),
        new StubEntity({ name: 'TEST', price: 1 }),
      ]
      const spyFilterMethod = jest.spyOn(items, 'filter')

      let itemsFiltered = await sut['applyFilter'](items, 'TEST')

      expect(itemsFiltered).toStrictEqual([items[1], items[2]])
      expect(spyFilterMethod).toHaveBeenCalledTimes(1)

      itemsFiltered = await sut['applyFilter'](items, 'field_non_existent')

      expect(itemsFiltered).toHaveLength(0)
      expect(spyFilterMethod).toHaveBeenCalledTimes(2)
    })
  })

  describe('applySort method', () => {
    it('Should no sort items', async () => {
      let items = [
        new StubEntity({ name: 'A', price: 1 }),
        new StubEntity({ name: 'B', price: 1 }),
      ]

      let itemsSorted = await sut['applySort'](items, null, null)

      expect(itemsSorted).toStrictEqual(items)

      itemsSorted = await sut['applySort'](items, 'price', 'asc')

      expect(itemsSorted).toStrictEqual(items)
    })

    it('Should sort items', async () => {
      let items = [
        new StubEntity({ name: 'B', price: 1 }),
        new StubEntity({ name: 'A', price: 1 }),
        new StubEntity({ name: 'C', price: 1 }),
      ]

      let itemsSorted = await sut['applySort'](items, 'name', 'asc')
      expect(itemsSorted).toStrictEqual([items[1], items[0], items[2]])

      itemsSorted = await sut['applySort'](items, 'name', 'desc')
      expect(itemsSorted).toStrictEqual([items[2], items[0], items[1]])
    })
  })

  describe('applyPaginate method', () => {
    it('Should paginate items', async () => {
      let items = [
        new StubEntity({ name: 'A', price: 1 }),
        new StubEntity({ name: 'B', price: 1 }),
        new StubEntity({ name: 'C', price: 1 }),
        new StubEntity({ name: 'D', price: 1 }),
        new StubEntity({ name: 'E', price: 1 }),
      ]

      let itemsPaginated = await sut['applyPaginate'](items, 1, 2)
      expect(itemsPaginated).toStrictEqual([items[0], items[1]])

      itemsPaginated = await sut['applyPaginate'](items, 2, 2)
      expect(itemsPaginated).toStrictEqual([items[2], items[3]])

      itemsPaginated = await sut['applyPaginate'](items, 3, 2)
      expect(itemsPaginated).toStrictEqual([items[4]])

      itemsPaginated = await sut['applyPaginate'](items, 4, 2)
      expect(itemsPaginated).toStrictEqual([])
    })
  })

  describe('search method', () => {
    it('Should apply only pagination when the other params is null', async () => {
      const entity = new StubEntity({ name: 'any_name', price: 1 })
      let items: StubEntity[] = Array(16).fill(entity)

      sut.items = items

      const params = await sut.search(new SearchParams())
      expect(params).toStrictEqual(
        new SearchResult({
          items: Array(15).fill(entity),
          total: 16,
          currentPage: 1,
          perPage: 15,
          sort: null,
          sortDir: null,
          filter: null,
        }),
      )
    })

    it('Should apply Pagination and Filter when the other params is null', async () => {
      const items = [
        new StubEntity({ name: 'test', price: 1 }),
        new StubEntity({ name: 'a', price: 1 }),
        new StubEntity({ name: 'TEST', price: 1 }),
        new StubEntity({ name: 'TeSt', price: 1 }),
      ]

      sut.items = items

      let params = await sut.search(
        new SearchParams({
          page: 1,
          perPage: 2,
          filter: 'TEST',
        }),
      )

      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[0], items[2]],
          total: 3,
          currentPage: 1,
          perPage: 2,
          sort: null,
          sortDir: null,
          filter: 'TEST',
        }),
      )

      params = await sut.search(
        new SearchParams({
          page: 2,
          perPage: 2,
          filter: 'TEST',
        }),
      )

      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[3]],
          total: 3,
          currentPage: 2,
          perPage: 2,
          sort: null,
          sortDir: null,
          filter: 'TEST',
        }),
      )
    })

    it('Should apply Pagination and Sort when the other params is null', async () => {
      const items = [
        new StubEntity({ name: 'b', price: 1 }),
        new StubEntity({ name: 'a', price: 1 }),
        new StubEntity({ name: 'd', price: 1 }),
        new StubEntity({ name: 'e', price: 1 }),
        new StubEntity({ name: 'c', price: 1 }),
      ]

      sut.items = items

      //TODO: dividir cada expect em outro it ou separar em outro describe

      let params = await sut.search(
        new SearchParams({
          page: 1,
          perPage: 2,
          sortBy: 'name',
        }),
      )

      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[3], items[2]],
          total: 5,
          currentPage: 1,
          perPage: 2,
          sort: 'name',
          sortDir: 'desc',
          filter: null,
        }),
      )

      params = await sut.search(
        new SearchParams({
          page: 2,
          perPage: 2,
          sortBy: 'name',
        }),
      )

      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[4], items[0]],
          total: 5,
          currentPage: 2,
          perPage: 2,
          sort: 'name',
          sortDir: 'desc',
          filter: null,
        }),
      )

      params = await sut.search(
        new SearchParams({
          page: 1,
          perPage: 2,
          sortBy: 'name',
          sortDir: 'asc',
        }),
      )

      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[1], items[0]],
          total: 5,
          currentPage: 1,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
          filter: null,
        }),
      )

      params = await sut.search(
        new SearchParams({
          page: 3,
          perPage: 2,
          sortBy: 'name',
          sortDir: 'asc',
        }),
      )

      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[3]],
          total: 5,
          currentPage: 3,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
          filter: null,
        }),
      )
    })
  })
})
