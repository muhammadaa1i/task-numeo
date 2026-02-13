import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react"
import type { User, UsersPageResult } from "../../domains/users/model"
import type { PageArgs, UsersRepository } from "../../domains/users/repository"
import { mockUserRepository } from "./api.mock"

export const PAGE_SIZE = 60

const repo: UsersRepository = mockUserRepository

type UserCache = UsersPageResult & { items: User[] }  // checks items exist on cache

export const usersApi = createApi({
    reducerPath: 'usersApi',
    baseQuery: fakeBaseQuery(),
    endpoints: (build) => ({
        getUsers: build.query<UserCache, PageArgs>({
            async queryFn(arg) {
                try {
                    const data = await repo.fetchPage(arg)
                    return {
                        data: {
                            ...data, items: data.items
                        }
                    }
                } catch (e) {
                    return { error: e as any }
                }
            },

            // one cache entry per query+limit
            serializeQueryArgs: ({ queryArgs }) => ({
                query: queryArgs.query,
                limit: queryArgs.limit
            }),

            // append unique users
            merge: (currentCache, newPage) => {
                const seen = new Set(currentCache.items.map((u) => u.id))
                for (const u of newPage.items) {
                    if (!seen.has(u.id)) currentCache.items.push(u)
                }
                currentCache.total = newPage.total
                currentCache.offset = newPage.offset
                currentCache.limit = newPage.limit
            },

            forceRefetch({ currentArg, previousArg }) {
                if (!currentArg || !previousArg) return true
                return JSON.stringify(currentArg.query) !== JSON.stringify(previousArg.query)
            }
        }),

        updateUser: build.mutation<User, { id: string, patch: Partial<User>, listArgs: PageArgs }>({
            async queryFn({ id, patch }) {
                try {
                    const data = await repo.updateUser({ id, patch })
                    return { data }
                } catch (e) {
                    return { error: e as any }
                }
            },

            async onQueryStarted({ id, patch, listArgs }, { dispatch, queryFulfilled }) {
                // optimistic update 
                const patchResult = dispatch(
                    usersApi.util.updateQueryData('getUsers', listArgs, (draft) => {
                        const u = draft.items.find((x) => x.id === id)
                        if (u) Object.assign(u, patch)
                    })
                )

                try {
                    await queryFulfilled
                } catch {
                    patchResult.undo() // rollback
                }
            }
        })
    })
})

export const { useGetUsersQuery, useUpdateUserMutation } = usersApi