import { useMemo, useRef, useEffect } from "react"
import type { SortDir, SortKey, UsersQuery } from "../../domains/users/model"
import { debounce } from "../../lib/debounce"

type Props = {
  q: string
  setQ: (v: string) => void
  status: UsersQuery["status"]
  setStatus: (v: UsersQuery["status"]) => void
  sortKey: SortKey
  setSortKey: (v: SortKey) => void
  sortDir: SortDir
  setSortDir: (v: SortDir) => void
  total: number
  onQueryChanged: () => void
}

export default function UsersToolbar(props: Props) {
  const { q, setQ, status, setStatus, sortKey, setSortKey, sortDir, setSortDir, total, onQueryChanged } = props

  const setQDebounced = useMemo(
    () =>
      debounce((v: string) => {
        setQ(v)
        onQueryChanged()
      }, 400),
    [setQ, onQueryChanged]
  )

  const inputRef = useRef<HTMLInputElement | null>(null)
  useEffect(() => {
    if (inputRef.current && inputRef.current.value !== q) inputRef.current.value = q
  }, [q])

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 170px 170px 120px auto", gap: 8, alignItems: "center" }}>
      <input
        ref={inputRef}
        defaultValue={q}
        placeholder="Search name/email/country… (debounced)"
        onChange={(e) => setQDebounced(e.target.value)}
        style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd" }}
      />

      <select
        value={status}
        onChange={(e) => {
          setStatus(e.target.value as UsersQuery["status"])
          onQueryChanged()
        }}
        style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd" }}
      >
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="blocked">Blocked</option>
      </select>

      <select
        value={sortKey}
        onChange={(e) => {
          setSortKey(e.target.value as SortKey)
          onQueryChanged()
        }}
        style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd" }}
      >
        <option value="createdAt">Created</option>
        <option value="name">Name</option>
        <option value="email">Email</option>
        <option value="age">Age</option>
      </select>

      <button
        onClick={() => {
          setSortDir(sortDir === "asc" ? "desc" : "asc")
          onQueryChanged()
        }}
        style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd", background: "white", cursor: "pointer" }}
      >
        {sortDir === "asc" ? "Asc ↑" : "Desc ↓"}
      </button>

      <div style={{ justifySelf: "end", opacity: 0.8 }}>
        Total: <b>{total}</b>
      </div>
    </div>
  )
}