import { Entity } from '@/shared/domain/entities/entity'
import { InMemoryRepository } from '../../in-memory.repository'
import { InMemorySearchableRepository } from '../../in-memory-searchable.repository'

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

  describe('applyPaginate method', () => {})

  describe('search method', () => {})
})
