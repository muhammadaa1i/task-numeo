import type { UsersQuery } from "./model";

export const defaultUsersQuery: UsersQuery = {
    q: '',
    status: 'all',
    sortKey: 'createdAt',
    sortDir: 'desc'
}