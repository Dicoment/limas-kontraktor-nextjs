import Link from "next/link"

export default function GlobalNotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">

        {/* Angka 404 */}
        <h1 className="text-[300px] font-bold leading-none text-[#1B3A6B] opacity-10 select-none">
          404
        </h1>

        {/* Konten */}
        <div className="-mt-20">
          <h2 className="text-4xl font-bold text-[#1B3A6B] mb-3">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            Halaman yang kamu cari tidak ada atau sudah dipindahkan.
            Coba kembali ke beranda.
          </p>

          {/* Tombol */}
          <div className="flex gap-3 justify-center">
            <Link
              href="/"
              className="px-6 py-2.5 bg-[#1B3A6B] text-white text-sm font-medium rounded-xl hover:bg-[#15305a] transition-colors"
            >
              Kembali ke Beranda
            </Link>
            <Link
              href="/kontak"
              className="px-6 py-2.5 border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-100 transition-colors"
            >
              Hubungi Kami
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}