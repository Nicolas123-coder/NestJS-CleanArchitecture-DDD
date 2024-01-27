import { UpdatePasswordUseCase } from '@/users/application/usecases/updatePassword.usecase'

// [INFO] esse Omit é para omitir o id tipo UpdateUserUseCase.Input, já que ele vem como Param
// na url e não no Body da requisição
export class UpdatePasswordDto
  implements Omit<UpdatePasswordUseCase.Input, 'id'>
{
  password: string
  oldPassword: string
}
