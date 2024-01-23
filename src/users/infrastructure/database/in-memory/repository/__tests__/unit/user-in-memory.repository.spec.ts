import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserInMemoryRepository } from '../../user-in-memory.repository'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { ConflictError } from '@/shared/domain/errors/conflict-error'

describe('UserInMemoryRepository unit tests', () => {
  let sut: UserInMemoryRepository

  beforeEach(() => {
    sut = new UserInMemoryRepository()
  })

  it('Should throw error when not found - findByEmail method', async () => {
    await expect(sut.findByEmail('test@test.com')).rejects.toThrow(
      new NotFoundError('Entity Not Found by test@test.com'),
    )
  })

  it('Should find a Entity by Email - findByEmail method', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    await sut.insert(entity)

    const result = await sut.findByEmail(entity.email)

    await expect(entity.toJSON()).toStrictEqual(result.toJSON())
  })

  it('Should throw error when not found - emailExists method', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    await sut.insert(entity)

    await expect(sut.emailExists(entity.email)).rejects.toThrow(
      new ConflictError('Email already in use'),
    )
  })

  it('Should find a Entity by Email - emailExists method', async () => {
    expect.assertions(0)
    await sut.emailExists('test@test.com')
  })

  it('Should no filter items when filter object is null - applyFilter method', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    await sut.insert(entity)

    const result = await sut.findAll()
    const spyFilter = jest.spyOn(result, 'filter')
    const itemsFiltered = await sut['applyFilter'](result, null)

    expect(spyFilter).not.toHaveBeenCalled()
    await expect(itemsFiltered).toStrictEqual(result)
  })

  it('Should filter name field when passed filter params - applyFilter method', async () => {
    const items = [
      new UserEntity(UserDataBuilder({ name: 'Test' })),
      new UserEntity(UserDataBuilder({ name: 'TEST' })),
      new UserEntity(UserDataBuilder({ name: 'fake' })),
    ]

    const spyFilter = jest.spyOn(items, 'filter')
    const itemsFiltered = await sut['applyFilter'](items, 'TEST')

    expect(spyFilter).toHaveBeenCalled()
    await expect(itemsFiltered).toStrictEqual([items[0], items[1]])
  })

  it('Should sort by createdAt field when sort params is null - applySort method', async () => {
    const createdAt = new Date()

    const items = [
      new UserEntity(UserDataBuilder({ name: 'Test', createdAt: createdAt })),
      new UserEntity(
        UserDataBuilder({
          name: 'TEST',
          createdAt: new Date(createdAt.getTime() + 1),
        }),
      ),
      new UserEntity(
        UserDataBuilder({
          name: 'fake',
          createdAt: new Date(createdAt.getTime() + 2),
        }),
      ),
    ]

    const itemsSorted = await sut['applySort'](items, null, null)

    await expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]])
  })

  it('Should sort by name field - applySort method', async () => {
    const items = [
      new UserEntity(UserDataBuilder({ name: 'c' })),
      new UserEntity(
        UserDataBuilder({
          name: 'd',
        }),
      ),
      new UserEntity(
        UserDataBuilder({
          name: 'a',
        }),
      ),
    ]

    let itemsSorted = await sut['applySort'](items, 'name', 'asc')
    await expect(itemsSorted).toStrictEqual([items[2], items[0], items[1]])

    itemsSorted = await sut['applySort'](items, 'name', null)
    await expect(itemsSorted).toStrictEqual([items[1], items[0], items[2]])
  })
})
