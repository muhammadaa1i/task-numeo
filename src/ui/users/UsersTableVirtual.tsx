import { memo, useCallback, useMemo, type ReactElement } from "react"
import { List, useListCallbackRef, type RowComponentProps, type ListProps } from "react-window"
import { useInfiniteLoader } from "react-window-infinite-loader"
import type { User } from "../../domains/users/model"
import { expensiveScore } from "../../lib/expensive"

type Props = {
  items: User[]
  total: number
  isLoading: boolean
  isError: boolean
  errorMessage?: string
  hasNextPage: boolean
  isFetchingNextPage: boolean
  loadMore: () => void
  onRowClick: (u: User) => void
}

type RowData = { items: User[]; onRowClick: (u: User) => void }
const ROW_H = 52

const Row = memo(function Row({ index, style, items, onRowClick }: RowComponentProps<RowData>): ReactElement | null {
  const u = items[index]
  if (!u) {
    return (
      <div style={{ ...style, display: "flex", alignItems: "center", padding: "0 12px", opacity: 0.7 }}>
        Loading…
      </div>
    )
  }

  const score = expensiveScore(u.id + u.email)

  return (
    <div
      style={{
        ...style,
        display: "grid",
        gridTemplateColumns: "220px 1fr 80px 90px 80px 90px",
        alignItems: "center",
        padding: "0 12px",
        borderBottom: "1px solid #f0f0f0",
        cursor: "pointer",
      }}
      onClick={() => onRowClick(u)}
      title="Click for details"
    >
      <div style={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.name}</div>
      <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", opacity: 0.85 }}>{u.email}</div>
      <div>{u.age}</div>
      <div style={{ textTransform: "uppercase", opacity: 0.8 }}>{u.country}</div>
      <div style={{ color: u.status === "active" ? "green" : "crimson", fontWeight: 600 }}>{u.status}</div>
      <div style={{ textAlign: "right", opacity: 0.8 }}>S:{score}</div>
    </div>
  )
})

export default function UsersTableVirtual(props: Props) {
  const { items, total, isLoading, isError, errorMessage, hasNextPage, isFetchingNextPage, loadMore, onRowClick } = props

  if (isLoading) return <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 12 }}>Loading users…</div>

  if (isError) {
    return (
      <div style={{ padding: 12, border: "1px solid #f3c", borderRadius: 12 }}>
        <b>Error:</b> {errorMessage ?? "Unknown error"}
      </div>
    )
  }

  if (total === 0) return <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 12 }}>Empty state — no users.</div>

  const rowCount = hasNextPage ? items.length + 1 : items.length
  const isRowLoaded = useCallback((index: number) => !hasNextPage || index < items.length, [hasNextPage, items.length])

  const loadMoreRows = useCallback(async () => {
    if (!isFetchingNextPage && hasNextPage) loadMore()
  }, [isFetchingNextPage, hasNextPage, loadMore])

  const onRowsRendered = useInfiniteLoader({
    isRowLoaded,
    loadMoreRows,
    rowCount,
  })

  const [, setListRef] = useListCallbackRef()

  const rowProps = useMemo<RowData>(() => ({ items, onRowClick }), [items, onRowClick])

  return (
    <div style={{ border: "1px solid #eee", borderRadius: 12, overflow: "hidden" }}>
      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr 80px 90px 80px 90px", padding: "10px 12px", background: "#fafafa", borderBottom: "1px solid #eee", fontWeight: 700 }}>
        <div>Name</div><div>Email</div><div>Age</div><div>Country</div><div>Status</div><div style={{ textAlign: "right" }}>Score</div>
      </div>

      <List
        listRef={setListRef}
        rowComponent={Row as unknown as ListProps<RowData>["rowComponent"]}
        rowCount={rowCount}
        rowHeight={ROW_H}
        rowProps={rowProps}
        onRowsRendered={onRowsRendered}
        style={{ height: 560 }}
      />
    </div>
  )
}
