import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator'
import { ClassValidatorFields } from '../../class-validator-fields'

class StubRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string

  @IsNumber()
  @IsNotEmpty()
  price: number

  // [INFO] atribui aos dados da classe o que ela receber em "data"
  constructor(data: any) {
    Object.assign(this, data)
  }
}

class StubClassValidatorFields extends ClassValidatorFields<StubRules> {
  validate(data: any): boolean {
    return super.validate(new StubRules(data))
  }
}

describe('ClassValidatorFields integration tests', () => {
  // TODO: colocar emojis nos testes de sucesso e de erros
  it('Should validated with errors', () => {
    const sut = new StubClassValidatorFields()

    expect(sut.validate(null)).toBeFalsy()
    expect(sut.errors).toStrictEqual({
      name: [
        'name should not be empty',
        'name must be a string',
        'name must be shorter than or equal to 255 characters',
      ],
      price: [
        'price should not be empty',
        'price must be a number conforming to the specified constraints',
      ],
    })
  })

  it('Should validated without errors', () => {
    const sut = new StubClassValidatorFields()
    const entityFields = { name: 'value', price: 10 }

    expect(sut.validate(entityFields)).toBeTruthy()
    expect(sut.validatedData).toStrictEqual(new StubRules(entityFields))
  })
})
