import { UserRepository } from '@/users/domain/repository/user.repository'
import { BadRequestError } from '../errors/bad-request-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { HashProvider } from '@/shared/application/providers/hash-provider'

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
    // [INFO] Injeção de dependência (DI)
    constructor(
      private userRepository: UserRepository.Repository,
      private hashProvider: HashProvider,
    ) {}

    async execute(input: Input): Promise<Output> {
      // TODO: melhorar resposta para qual campo está faltando
      const { name, email, password } = input

      if (!name || !email || !password) {
        throw new BadRequestError('Input data not provided')
      }

      await this.userRepository.emailExists(email)
      const hashPassword = await this.hashProvider.generateHash(password)

      const entity = new UserEntity(
        Object.assign(input, { password: hashPassword }),
      )

      await this.userRepository.insert(entity)

      return entity.toJSON()
    }
  }
}
