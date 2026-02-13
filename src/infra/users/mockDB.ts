import { faker } from '@faker-js/faker'
import type { User } from '../../domains/users/model'

faker.seed(42)

const COUNTRIES = ['UZ', 'KG', "KZ", "TJ", "AE", "TR", "US", "DE", "FR", "GB"] as const

function makeUser(i: number): User {
    const first = faker.person.firstName()
    const last = faker.person.lastName()
    const status: User['status'] = faker.number.int({ min: 0, max: 9 }) < 8 ? 'active' : 'blocked'
    const country = faker.helpers.arrayElement(COUNTRIES)

    return {
        id: `u_${i}_${faker.string.alphanumeric(10)}`,
        name: `${first} ${last}`,
        email: faker.internet.email({ firstName: first, lastName: last }),
        age: faker.number.int({ min: 16, max: 75 }),
        status,
        country,
        createdAt: faker.date.past({ years: 3 }).getTime()
    }
}

export const db: User[] = Array.from({ length: 10_000 }, (_, i) => makeUser(i + 1))

export function updateUserInDb(id: string, patch: Partial<User>) {
    const idx = db.findIndex((u) => u.id === id)
    if (idx === -1) throw new Error('User not found')
    db[idx] = { ...db[idx], ...patch }
    return db[idx]
}