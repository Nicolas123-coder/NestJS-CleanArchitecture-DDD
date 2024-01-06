import { RepositoryInterface } from './repository-contracts'
import { NotFoundError } from '../errors/not-found-error'
import { Entity } from '../entities/entity'

export abstract class InMemoryRepository<E extends Entity>
  implements RepositoryInterface<E>
{
  items: E[] = []

  async insert(entity: E): Promise<void> {
    this.items.push(entity)
  }

  async findById(id: string): Promise<E> {
    // [INFO] essa transformação com crase transforma automaticamente o id pra uma string
    const _id = `${id}`
    const entity = this.items.find(item => item.id === _id)

    if (!entity) {
      throw new NotFoundError('Entity Not Found')
    }

    return entity
  }

  async findAll(): Promise<E[]> {
    return this.items
  }

  async update(entity: E): Promise<void> {
    const _entity = await this.findById(entity.id)
    const index = this.items.findIndex(item => item.id === _entity.id)

    this.items[index] = entity
  }

  async delete(id: string): Promise<void> {
    const _entity = await this.findById(id)
    const entityIndex = this.items.findIndex(item => item.id === _entity.id)

    this.items.splice(entityIndex, 1)
  }
}
