import type { User, UsersPageResult, UsersQuery } from "./model";

export type PageArgs = { query: UsersQuery, offset: number, limit: number }

export interface UsersRepository {
    fetchPage(args: PageArgs): Promise<UsersPageResult>
    updateUser(args: { id: string; patch: Partial<User> }): Promise<User>
}