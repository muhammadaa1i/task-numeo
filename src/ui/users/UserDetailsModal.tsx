import { useMemo } from "react"
import { useForm } from "react-hook-form"
import type { User } from "../../domains/users/model"
import type { PageArgs } from "../../domains/users/repository"
import { useUpdateUserMutation } from "../../infra/users/repo.tkq"

type FormValues = { name: string; email: string; age: number; status: "active" | "blocked"; country: string }

function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "message" in error && typeof (error as { message: unknown }).message === "string") {
    return (error as { message: string }).message
  }
  return String(error)
}

export default function UserDetailsModal(props: { user: User; listArgs: PageArgs; onClose: () => void }) {
  const { user, listArgs, onClose } = props
  const [updateUser, upd] = useUpdateUserMutation()

  const defaultValues = useMemo<FormValues>(() => ({
    name: user.name,
    email: user.email,
    age: user.age,
    status: user.status,
    country: user.country,
  }), [user])

  const { register, handleSubmit, formState } = useForm<FormValues>({ defaultValues })

  const onSubmit = handleSubmit((values) => {
    updateUser({ id: user.id, patch: values, listArgs })
  })

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", display: "grid", placeItems: "center", padding: 16 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "min(720px, 100%)", background: "white", borderRadius: 14, border: "1px solid #eee", padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18 }}>{user.name}</div>
            <div style={{ opacity: 0.7, fontSize: 12 }}>ID: {user.id}</div>
          </div>
          <button onClick={onClose} style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid #ddd", background: "white" }}>
            Close
          </button>
        </div>

        <form onSubmit={onSubmit} style={{ marginTop: 14, display: "grid", gap: 10 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontSize: 12, opacity: 0.8 }}>Name</span>
              <input {...register("name", { required: true })} style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd" }} />
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontSize: 12, opacity: 0.8 }}>Email</span>
              <input {...register("email", { required: true })} style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd" }} />
            </label>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "120px 160px 1fr", gap: 10 }}>
            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontSize: 12, opacity: 0.8 }}>Age</span>
              <input type="number" {...register("age", { valueAsNumber: true, min: 1, max: 120 })} style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd" }} />
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontSize: 12, opacity: 0.8 }}>Status</span>
              <select {...register("status")} style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd" }}>
                <option value="active">active</option>
                <option value="blocked">blocked</option>
              </select>
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontSize: 12, opacity: 0.8 }}>Country</span>
              <input {...register("country", { required: true })} style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd" }} />
            </label>
          </div>

          {upd.isError && (
            <div style={{ padding: 10, borderRadius: 10, border: "1px solid #f3c", background: "#fff5fb" }}>
              <b>Save failed:</b> {getErrorMessage(upd.error)}
              <div style={{ opacity: 0.75, marginTop: 4 }}>Optimistic update was rolled back automatically.</div>
            </div>
          )}

          {upd.isSuccess && (
            <div style={{ padding: 10, borderRadius: 10, border: "1px solid #cfc", background: "#f6fff6" }}>
              Saved successfully.
            </div>
          )}

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 6 }}>
            <button type="button" onClick={onClose} style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd", background: "white" }}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={formState.isSubmitting || upd.isLoading}
              style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #111", background: "#111", color: "white", cursor: "pointer", opacity: formState.isSubmitting || upd.isLoading ? 0.7 : 1 }}
            >
              {upd.isLoading ? "Saving…" : "Save (optimistic)"}
            </button>
          </div>

          <div style={{ marginTop: 6, fontSize: 12, opacity: 0.7 }}>
            Note: saves have a <b>20%</b> simulated failure rate to demonstrate rollback.
          </div>
        </form>
      </div>
    </div>
  )
}
