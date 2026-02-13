import { useCallback, useMemo, useState } from "react"
import type { SortDir, SortKey, User, UsersQuery } from "../../domains/users/model"
import { defaultUsersQuery } from "../../domains/users/query"
import { PAGE_SIZE, useGetUsersQuery } from "../../infra/users/repo.tkq"
import UsersToolbar from "./UsersToolbar"
import UsersTableVirtual from "./UsersTableVirtual"
import UserDetailsModal from "./UserDetailsModal"

export default function UsersPage() {
    const [q, setQ] = useState(defaultUsersQuery.q)
    const [status, setStatus] = useState<UsersQuery["status"]>(defaultUsersQuery.status)
    const [sortKey, setSortKey] = useState<SortKey>(defaultUsersQuery.sortKey)
    const [sortDir, setSortDir] = useState<SortDir>(defaultUsersQuery.sortDir)
    const [offset, setOffset] = useState(0)

    const query: UsersQuery = useMemo(() => ({ q, status, sortKey, sortDir }), [q, status, sortKey, sortDir])
    const listArgs = useMemo(() => ({ query, offset, limit: PAGE_SIZE }), [query, offset])

    const res = useGetUsersQuery(listArgs)

    const items = res.data?.items ?? []
    const total = res.data?.total ?? 0
    const hasNextPage = items.length < total

    const [selected, setSelected] = useState<User | null>(null)
    const onRowClick = useCallback((u: User) => setSelected(u), [])
    const closeModal = useCallback(() => setSelected(null), [])

    const onQueryChangeReset = useCallback(() => setOffset(0), [])

    const loadMore = useCallback(() => {
        if (!hasNextPage) return
        setOffset(items.length)
    }, [hasNextPage, items.length])

    const selectedResolved = useMemo(() => {
        if (!selected) return null
        return items.find((x) => x.id === selected.id) ?? selected
    }, [selected, items])

    return (
        <div style={{ display: "grid", gap: 12 }}>
            <UsersToolbar
                q={q}
                setQ={setQ}
                status={status}
                setStatus={setStatus}
                sortKey={sortKey}
                setSortKey={setSortKey}
                sortDir={sortDir}
                setSortDir={setSortDir}
                total={total}
                onQueryChanged={onQueryChangeReset}
            />

            <UsersTableVirtual
                items={items}
                total={total}
                isLoading={res.isLoading}
                isError={res.isError}
                errorMessage={res.error ? String((res.error as any).message ?? res.error) : undefined}
                hasNextPage={hasNextPage}
                isFetchingNextPage={res.isFetching}
                loadMore={loadMore}
                onRowClick={onRowClick}
            />

            {selectedResolved && <UserDetailsModal user={selectedResolved} listArgs={listArgs} onClose={closeModal} />}
        </div>
    )
}