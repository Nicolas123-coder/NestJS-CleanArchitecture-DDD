import { SignInUseCase } from '@/users/application/usecases/signIn.usecase'

export class SignInDto implements SignInUseCase.Input {
  email: string
  password: string
}
