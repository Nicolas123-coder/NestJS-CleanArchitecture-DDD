import { RepositoryInterface } from '@/shared/domain/repositories/repository-contracts'
import { UserEntity } from '../entities/user.entity'
import { SearcableRepositoryInterface } from '@/shared/domain/repositories/searchable-repository-contracts'

// FIXME: any, any
export interface UserRepository
  extends SearcableRepositoryInterface<UserEntity, any, any> {
  findByEmail(id: string): Promise<UserEntity>
  emailExists(email: string): Promise<void>
}
