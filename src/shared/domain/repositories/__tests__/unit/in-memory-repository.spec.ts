import { Entity } from '@/shared/domain/entities/entity'
import { InMemoryRepository } from '../../in-memory.repository'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'

type StubEntityProps = {
  name: string
  price: number
}

class StubEntity extends Entity<StubEntityProps> {}

class StubInMemoryRepository extends InMemoryRepository<StubEntity> {}

describe('InMemoryRepository unit tests', () => {
  let sut: StubInMemoryRepository

  beforeEach(() => {
    sut = new StubInMemoryRepository()
  })

  it('Should insert a new entity in memory repository', async () => {
    const entity = new StubEntity({
      name: 'test name',
      price: 10,
    })

    await sut.insert(entity)
    expect(entity.toJSON()).toStrictEqual(sut.items[0].toJSON())
  })

  it('Should throw error when entity not found', async () => {
    await expect(sut.findById('nonExistentId')).rejects.toThrow(
      new NotFoundError('Entity Not Found'),
    )
  })

  it('Should find an entity by ID', async () => {
    const entity = new StubEntity({
      name: 'test name',
      price: 10,
    })

    await sut.insert(entity)

    const result = await sut.findById(entity._id)

    expect(entity.toJSON()).toStrictEqual(result.toJSON())
  })

  it('Should find an entity by ID', async () => {
    const entity = new StubEntity({
      name: 'test name',
      price: 10,
    })

    await sut.insert(entity)

    const result = await sut.findById(entity._id)

    expect(entity.toJSON()).toStrictEqual(result.toJSON())
  })

  it('Should return all entities', async () => {
    const entity = new StubEntity({
      name: 'test name',
      price: 10,
    })

    await sut.insert(entity)

    const result = await sut.findAll()

    expect([entity]).toStrictEqual(result)
  })

  it('Should throw error on update when entity not found', async () => {
    const entity = new StubEntity({
      name: 'test name',
      price: 10,
    })

    await expect(sut.update(entity)).rejects.toThrow(
      new NotFoundError('Entity Not Found'),
    )
  })

  it('Should update an entity', async () => {
    const entity = new StubEntity({
      name: 'test name',
      price: 10,
    })

    await sut.insert(entity)

    const entityUpdated = new StubEntity(
      {
        name: 'nicolas',
        price: 20,
      },
      entity._id,
    )

    await sut.update(entityUpdated)

    expect(entityUpdated.toJSON()).toStrictEqual(sut.items[0].toJSON())
  })

  it('Should throw error on delete when entity not found', async () => {
    await expect(sut.delete('nonExistentId')).rejects.toThrow(
      new NotFoundError('Entity Not Found'),
    )
  })

  it('Should delete an entity', async () => {
    const entity = new StubEntity({
      name: 'test name',
      price: 10,
    })

    await sut.insert(entity)

    await sut.delete(entity._id)

    await expect(sut.items).toHaveLength(0)
  })
})
