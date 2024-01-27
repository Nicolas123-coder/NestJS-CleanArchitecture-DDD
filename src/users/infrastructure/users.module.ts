import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { SignupUseCase } from '../application/usecases/signUp.usecase'
import { UserRepository } from '../domain/repository/user.repository'
import { UserInMemoryRepository } from './database/in-memory/repository/user-in-memory.repository'
import { BcryptJsHashProvider } from './providers/hash-provider/bcrypt-hash.provider'
import { HashProvider } from '@/shared/application/providers/hash-provider'

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    // [INFO] Instanciando os provedores que serão injetados
    // no usecase abaixo
    {
      provide: 'UserRepository',
      useClass: UserInMemoryRepository,
    },
    {
      provide: 'HashProvider',
      useClass: BcryptJsHashProvider,
    },
    // [INFO] Registrando o usecase no módulo com as dependências injetadas
    {
      provide: SignupUseCase.UseCase,
      useFactory: (
        userRepository: UserRepository.Repository,
        hashProvider: HashProvider,
      ) => {
        return new SignupUseCase.UseCase(userRepository, hashProvider)
      },
      inject: ['UserRepository', 'HashProvider'],
    },
  ],
})
export class UsersModule {}
