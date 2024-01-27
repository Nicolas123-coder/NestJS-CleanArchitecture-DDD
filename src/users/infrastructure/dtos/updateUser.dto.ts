import { UpdateUserUseCase } from '@/users/application/usecases/updateUser.usecase'

// [INFO] esse Omit é para omitir o id tipo UpdateUserUseCase.Input, já que ele vem como Param
// na url e não no Body da requisição
export class UpdateUserDto implements Omit<UpdateUserUseCase.Input, 'id'> {
  name: string
}
