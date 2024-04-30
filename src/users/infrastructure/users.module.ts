import { Inject, Module } from '@nestjs/common'
import { UsersController } from './users.controller'
import { SignupUseCase } from '../application/usecases/signUp.usecase'
import { UserRepository } from '../domain/repository/user.repository'
import { UserInMemoryRepository } from './database/in-memory/repository/user-in-memory.repository'
import { BcryptJsHashProvider } from './providers/hash-provider/bcrypt-hash.provider'
import { HashProvider } from '@/shared/application/providers/hash-provider'
import { SignInUseCase } from '../application/usecases/signIn.usecase'
import { GetUserUseCase } from '../application/usecases/getUser.usecase'
import { ListUsersUseCase } from '../application/usecases/listUsers.usecase'
import { UpdateUserUseCase } from '../application/usecases/updateUser.usecase'
import { UpdatePasswordUseCase } from '../application/usecases/updatePassword.usecase'
import { DeleteUserUseCase } from '../application/usecases/deleteUser.uscase'
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service'
import { UserPrismaRepository } from './database/prisma/repositories/user-prisma-repository'

@Module({
  controllers: [UsersController],
  providers: [
    // [INFO] Instanciando os provedores que serão injetados
    // nos usecases abaixo. Preciso registrar no módulo para usar no Controller
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'UserRepository',
      // Neste caso tem que usar o Factory para adicionar as dependências necessárias
      useFactory: (prismaService: PrismaService) => {
        return new UserPrismaRepository(prismaService)
      },
      inject: ['PrismaService'],
    },
    {
      provide: 'HashProvider',
      useClass: BcryptJsHashProvider,
    },
    // [INFO] Registrando os usecases no módulo com as dependências injetadas
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
    {
      provide: SignInUseCase.UseCase,
      useFactory: (
        userRepository: UserRepository.Repository,
        hashProvider: HashProvider,
      ) => {
        return new SignInUseCase.UseCase(userRepository, hashProvider)
      },
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: GetUserUseCase.UseCase,
      useFactory: (userRepository: UserRepository.Repository) => {
        return new GetUserUseCase.UseCase(userRepository)
      },
      inject: ['UserRepository'],
    },
    {
      provide: ListUsersUseCase.UseCase,
      useFactory: (userRepository: UserRepository.Repository) => {
        return new ListUsersUseCase.UseCase(userRepository)
      },
      inject: ['UserRepository'],
    },
    {
      provide: UpdateUserUseCase.UseCase,
      useFactory: (userRepository: UserRepository.Repository) => {
        return new UpdateUserUseCase.UseCase(userRepository)
      },
      inject: ['UserRepository'],
    },
    {
      provide: UpdatePasswordUseCase.UseCase,
      useFactory: (
        userRepository: UserRepository.Repository,
        hashProvider: HashProvider,
      ) => {
        return new UpdatePasswordUseCase.UseCase(userRepository, hashProvider)
      },
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: DeleteUserUseCase.UseCase,
      useFactory: (userRepository: UserRepository.Repository) => {
        return new DeleteUserUseCase.UseCase(userRepository)
      },
      inject: ['UserRepository'],
    },
  ],
})
export class UsersModule {}
