import { Suspense } from "react"
import AdminLeadsLogsClient from "./AdminLeadsLogsClient"

export default function AdminLeadsLogsPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <AdminLeadsLogsClient />
    </Suspense>
  )
}
