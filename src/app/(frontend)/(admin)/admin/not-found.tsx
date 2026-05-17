export default function AdminNotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">404</h1>
        <p className="text-slate-500">Halaman admin tidak ditemukan.</p>
        <a href="/admin" className="text-blue-600 text-sm mt-4 inline-block">Kembali ke Dashboard</a>
      </div>
    </div>
  )
}