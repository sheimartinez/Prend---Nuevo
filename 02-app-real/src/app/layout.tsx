import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Prendé',
  description: 'Gestión privada para clubes',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#FBF9F6] text-[#1E293B] flex flex-col">
        <div className="flex-1">
          {children}
        </div>

        <footer className="border-t bg-white">
          <div className="mx-auto flex max-w-6xl justify-between px-8 py-4 text-sm text-gray-500">
            <span>© Prendé</span>

            <a href="/legal" className="hover:underline">
              Términos y privacidad
            </a>
          </div>
        </footer>
      </body>
    </html>
  )
}