import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  HttpCode,
  Query,
  Put,
} from '@nestjs/common'
import { SignUpDto } from './dtos/signUp.dto'
import { UpdateUserDto } from './dtos/updateUser.dto'
import { SignupUseCase } from '../application/usecases/signUp.usecase'
import { SignInUseCase } from '../application/usecases/signIn.usecase'
import { UpdateUserUseCase } from '../application/usecases/updateUser.usecase'
import { UpdatePasswordUseCase } from '../application/usecases/updatePassword.usecase'
import { DeleteUserUseCase } from '../application/usecases/deleteUser.uscase'
import { GetUserUseCase } from '../application/usecases/getUser.usecase'
import { ListUsersUseCase } from '../application/usecases/listUsers.usecase'
import { SignInDto } from './dtos/signIn.dto'
import { ListUsersDto } from './dtos/listUsers.dto'
import { UpdatePasswordDto } from './dtos/updatePassword.dto'

@Controller('users')
export class UsersController {
  // [INFO] Em vez de fazer uma Injeção de dependência manualmente no constructor como abaixo:
  //    constructor(private userRepository: UserRepository.Repository) {}

  // [INFO] Podemos usar o @Inject do NestJS para injetar as dependências
  //    @Inject('UserRepository')
  //    private userRepository: UserRepository.Repository

  @Inject(SignupUseCase.UseCase)
  private signUpUseCase: SignupUseCase.UseCase

  @Inject(SignInUseCase.UseCase)
  private signInUseCase: SignInUseCase.UseCase

  @Inject(UpdateUserUseCase.UseCase)
  private updateUserUseCase: UpdateUserUseCase.UseCase

  @Inject(UpdatePasswordUseCase.UseCase)
  private updatePasswordUseCase: UpdatePasswordUseCase.UseCase

  @Inject(DeleteUserUseCase.UseCase)
  private deleteUserUseCase: DeleteUserUseCase.UseCase

  @Inject(GetUserUseCase.UseCase)
  private getUserUseCase: GetUserUseCase.UseCase

  @Inject(ListUsersUseCase.UseCase)
  private listUsersUseCase: ListUsersUseCase.UseCase

  // ########################################
  // [INFO] Rotas chamando os usecases
  // ########################################

  @Post()
  async create(@Body() signUpDto: SignUpDto) {
    return this.signUpUseCase.execute(signUpDto)
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() signInDto: SignInDto) {
    return this.signInUseCase.execute(signInDto)
  }

  @Get()
  async search(@Query() searchParams: ListUsersDto) {
    return this.listUsersUseCase.execute(searchParams)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.getUserUseCase.execute({ id: id })
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.updateUserUseCase.execute({ id: id, ...updateUserDto })
  }

  @Patch(':id')
  async updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.updatePasswordUseCase.execute({ id: id, ...updatePasswordDto })
  }

  @HttpCode(204)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.deleteUserUseCase.execute({ id: id })
  }
}
