import NextAuth, { type DefaultSession, type NextAuthResult } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { authConfig } from "./auth.config"

/**
 * EXTENSION TYPE DECLARATION (Module Augmentation)
 * Menambahkan properti kustom 'id' dan 'role' ke dalam objek bawaan NextAuth.
 * PENTING: Jangan hapus bagian ini karena digunakan oleh Middleware dan Server Component
 * untuk membatasi hak akses halaman dashboard / admin.
 */
declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string
      role: string
    }
  }

  interface User {
    id: string
    role: string
  }

  interface JWT {
    id: string
    role: string
  }
}

/**
 * AUTHENTICATION CONFIGURATION & HANDLERS
 * NOTE: Tipe `: NextAuthResult` ditambahkan secara eksplisit untuk mengatasi bug kompilasi 
 * "The inferred type of 'auth' cannot be named without a reference..." saat Next.js melakukan production build.
 */
export const { handlers, signIn, signOut, auth }: NextAuthResult = NextAuth({
  ...(authConfig as any),
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      /**
       * Validasi kredensial pengguna yang masuk berdasarkan data email dan password di database.
       */
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const email = credentials.email as string
        const password = credentials.password as string

        // Mencari user di PostgreSQL via Prisma Client
        const user = await prisma.user.findUnique({
          where: { email },
        })

        if (!user) return null

        // Komparasi password terenkripsi menggunakan bcrypt
        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) return null

        // Return objek user yang akan dilempar ke JWT Callback
        return {
          id: user.id,
          email: user.email ?? null,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt", // Menggunakan JWT Session agar stateless dan performa server ringan
  },
  callbacks: {
    /**
     * Memasukkan data user dari database ke dalam token JWT saat sesi pertama kali dibuat.
     */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role: string }).role
      }
      return token
    },
    /**
     * Mentransfer data dari token JWT ke dalam objek Session agar bisa dibaca di sisi client via `useSession()`.
     */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login", // Redirect kustom jika user mencoba mengakses halaman terproteksi
    error: "/login",
  },
})

// Ekspor handler API Route untuk menangani request GET/POST ke /api/auth/*
export const GET = handlers.GET
export const POST = handlers.POST