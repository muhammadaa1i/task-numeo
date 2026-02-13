import type { User, UsersPageResult, UsersQuery } from "../../domains/users/model"
import type { UsersRepository } from "../../domains/users/repository"
import { db, updateUserInDb } from "./mockDB"

function sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms))
}

function compare(a: unknown, b: unknown) {
    if (a === b) return 0
    return a! > b! ? 1 : -1
}

function applyQuery(all: User[], query: UsersQuery) {
    const q = query.q.trim().toLowerCase()
    let filtered = all

    if (query.status !== 'all') filtered = filtered.filter((u) => u.status === query.status)

    if (q.length) {
        filtered = filtered.filter((u) => {
            const hay = `${u.name} ${u.email}`.toLowerCase()
            return hay.includes(q)
        })
    }

    const dir = query.sortDir === 'asc' ? 1 : -1
    const key = query.sortKey
    filtered = [...filtered].sort((a, b) => dir * compare(a[key], b[key]))

    return filtered
}

export const mockUserRepository: UsersRepository = {
    async fetchPage({ query, offset, limit }) {
        await sleep(200 + Math.random() * 300)
        if (Math.random() < 0.03) throw new Error('Random network error while loading users')

        const filtered = applyQuery(db, query)
        const total = filtered.length
        const items = filtered.slice(offset, offset + limit)

        const result: UsersPageResult = { items, total, offset, limit }

        return result
    },

    async updateUser({ id, patch }) {
        await sleep(250 + Math.random() * 350)
        if (Math.random() < 0.2) throw new Error('Random save failure (simulated)')
        return updateUserInDb(id, patch)
    }
}