import { BcryptJsHashProvider } from '../bcrypt-hash.provider'

describe('BcryptJsHashProvider unit tests', () => {
  let sut: BcryptJsHashProvider

  beforeEach(() => {
    sut = new BcryptJsHashProvider()
  })

  it('Should return encrypted password', async () => {
    const password = 'testPassword'

    const hash = await sut.generateHash(password)

    expect(hash).toBeDefined()
    expect(hash).not.toEqual(password)
  })

  it('Should return false on invalid password and hash comparison', async () => {
    const password = 'testPassword'

    const hash = await sut.generateHash(password)

    const result = await sut.compareHash('invalidPassword', hash)

    expect(result).toBeFalsy()
  })

  it('Should return true on valid password and hash comparison', async () => {
    const password = 'testPassword'

    const hash = await sut.generateHash(password)

    const result = await sut.compareHash('testPassword', hash)

    expect(result).toBeTruthy()
  })
})
