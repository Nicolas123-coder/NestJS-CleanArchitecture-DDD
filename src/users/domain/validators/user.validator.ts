import {
  MaxLength,
  IsString,
  IsNotEmpty,
  IsDate,
  IsOptional,
  IsEmail,
} from 'class-validator'
import { UserProps } from '../entities/user.entity'
import { ClassValidatorFields } from '@/shared/domain/validators/class-validator-fields'

export class UserRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string

  @MaxLength(255)
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string

  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  password: string

  @IsDate()
  @IsOptional()
  createdAt: Date

  // [INFO] atribui aos dados da classe o que ela receber em "data"
  constructor({ email, name, password, createdAt }: UserProps) {
    Object.assign(this, { email, name, password, createdAt })
  }
}

export class UserValidator extends ClassValidatorFields<UserRules> {
  validate(data: UserProps): boolean {
    return super.validate(new UserRules(data ?? ({} as UserProps)))
  }
}

// [INFO] Factory: esse Design Pattern expõe uma classe com um método que cria uma ou mais outras classes por sua vez.
export class UserValidatorFactory {
  static create(): UserValidator {
    return new UserValidator()
  }
}
