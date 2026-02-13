export type User = {
    id: string
    name: string
    email: string
    age: number
    status: 'active' | 'blocked'
    country: string
    createdAt: number
}

export type SortKey = 'name' | 'email' | 'age' | 'createdAt'
export type SortDir = 'asc' | 'desc'

export type UsersQuery = {
    q: string
    status: 'all' | 'active' | 'blocked'
    sortKey: SortKey
    sortDir: SortDir
}

export type UsersPageResult = {
    items: User[]
    total: number
    offset: number
    limit: number
}