import { Entity } from '../entities/entity'
import { SearcableRepositoryInterface } from './searchable-repository-contracts'
import { InMemoryRepository } from './in-memory.repository'

export abstract class InMemorySearchableRepository<E extends Entity>
  // FIXME: any, any
  extends InMemoryRepository<E>
  implements SearcableRepositoryInterface<E, any, any>
{
  search(props: any): Promise<any> {

    throw new Error('Method not implemented.')
  }
  items: E[] = []
}
