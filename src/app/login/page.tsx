"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Eye, EyeOff, AlertCircle } from "lucide-react"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (res?.error) {
      setError("Email atau password salah")
      setLoading(false)
    } else {
      router.push("/dashboard")
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* Kolom Kiri — Full Gambar */}
      <div className="hidden md:block w-1/2 relative">
        <Image
          src="/loginbg.jpeg"
          alt="Proyek konstruksi Limas"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay gelap */}
        <div className="absolute inset-0 bg-[#1B3A6B]/60" />
        {/* Teks di atas overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-12 z-10">
          <Image
            src="/logo-putih.png"
            alt="Logo Limas Kontraktor"
            width={400}
            height={60}
            className="object-contain mb-6"
          />
        </div>
      </div>

      {/* Kolom Kanan — Form Login */}
      <div className="w-full md:w-1/2 bg-white flex flex-col justify-center px-12 lg:px-20 py-12">

        {/* Logo untuk mobile */}
        <div className="md:hidden mb-8">
          <Image
            src="/logo-biru.png"
            alt="Logo Limas Kontraktor"
            width={120}
            height={48}
            className="object-contain"
          />
        </div>

        {/* Logo + Brand */}
        <div className="mb-10">
          <div className="hidden md:block mb-6">
            <Image
              src="/logo-biru.png"
              alt="Logo Limas Kontraktor"
              width={150}
              height={56}
              className="object-contain"
            />
          </div>
          <p className="text-sm font-medium text-[#E87722] uppercase tracking-widest mb-2">
            Admin Dashboard
          </p>
          <h1 className="text-3xl font-bold text-[#1B3A6B] mb-2">
            Masuk ke Dashboard
          </h1>
          <p className="text-slate-400 text-sm">
            Gunakan akun admin yang telah diberikan
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/20 focus:border-[#1B3A6B] transition-colors"
              placeholder="admin@limaskontraktor.com"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/20 focus:border-[#1B3A6B] transition-colors"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-4 py-3 rounded-xl">
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#1B3A6B] text-white rounded-xl text-sm font-semibold hover:bg-[#15305a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-2"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>

        </form>
      </div>
    </div>
  )
}