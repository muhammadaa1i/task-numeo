import UsersPage from "./ui/users/UsersPage"

export default function App() {
  return (
    <div style={{ fontFamily: "system-ui", padding: 16, maxWidth: 1200, margin: "0 auto" }}>
      <h2 style={{ margin: "8px 0 16px" }}>High-Volume Users Dashboard (RTK Query)</h2>
      <UsersPage />
    </div>
  )
}