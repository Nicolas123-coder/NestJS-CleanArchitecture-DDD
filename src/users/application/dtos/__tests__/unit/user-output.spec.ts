import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserOutputMapper } from '../../user-output'

describe('UserOutputMapper unit tests', () => {
  it('Should convert a User in Output', () => {
    const entity = new UserEntity(UserDataBuilder({}))
    const spyToJSON = jest.spyOn(entity, 'toJSON')

    const sut = UserOutputMapper.toOutput(entity)

    expect(spyToJSON).toHaveBeenCalledTimes(1)
    expect(sut).toStrictEqual(entity.toJSON())
  })
})
