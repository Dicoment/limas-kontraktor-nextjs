import { Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"], 
  variable: "--font-jakarta-sans",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">    
      <body className={`${jakartaSans.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}