// src/lib/auth.config.ts
import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // Anda bisa menambahkan callback authorized atau jwt di sini jika perlu
  },
  // Kosongkan array providers di sini, kita akan mengisinya di auth.ts
  providers: [], 
} satisfies NextAuthConfig