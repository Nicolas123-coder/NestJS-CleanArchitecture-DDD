import { ConflictError } from '@/shared/domain/errors/conflict-error'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { InMemorySearchableRepository } from '@/shared/domain/repositories/in-memory-searchable.repository'
import { InMemoryRepository } from '@/shared/domain/repositories/in-memory.repository'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserRepository } from '@/users/domain/repository/user.repository'

export class UserInMemoryRepository
  extends InMemorySearchableRepository<UserEntity>
  implements UserRepository
{
  async findByEmail(email: string): Promise<UserEntity> {
    const entity = this.items.find(item => item.email === email)

    if (!entity) {
      throw new NotFoundError(`Entity Not Found by ${email}`)
    }

    return entity
  }

  async emailExists(email: string): Promise<void> {
    const entity = this.items.find(item => item.email === email)

    // [INFO] verifica se tem email para bloquear a criação de user com email repetido
    if (entity) {
      throw new ConflictError('Email already in use')
    }
  }
}
