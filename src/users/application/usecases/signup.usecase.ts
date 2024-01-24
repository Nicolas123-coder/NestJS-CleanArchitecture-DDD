import { UserRepository } from '@/users/domain/repository/user.repository'
import { BadRequestError } from '../errors/bad-request-error'
import { UserEntity } from '@/users/domain/entities/user.entity'

export namespace SignupUseCase {
  export type Input = {
    name: string
    email: string
    password: string
  }

  export type Output = {
    id: string
    name: string
    email: string
    // TODO: remover password daqui
    password: string
    createdAt: Date
  }

  export class UseCase {
    constructor(private userRepository: UserRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      // TODO: melhorar resposta para qual campo está faltando
      const { name, email, password } = input

      if (!name || !email || !password) {
        throw new BadRequestError('Input data not provided')
      }

      await this.userRepository.emailExists(email)

      const entity = new UserEntity(input)

      await this.userRepository.insert(entity)

      return entity.toJSON()
    }
  }
}
