import { fakerES as faker } from '@faker-js/faker'

export const getUuid = () => {
    let uuid = faker.string.uuid()
    return uuid
}

//console.log(getUuid())