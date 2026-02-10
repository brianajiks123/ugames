import React from "react"
import type { Metadata } from 'next'
import { AuthProvider } from '@/components/auth-provider'
import { FloatingChat } from "@/components/floating-chat"
import './globals.css'

export const metadata: Metadata = {
  title: 'UTD Games - Top Up Game Mudah & Cepat',
  description: 'Top up game favorit kamu dengan mudah, cepat, dan harga terjangkau. Mobile Legends, Free Fire, PUBG, Genshin Impact, dan banyak lagi.',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <AuthProvider>
          {children}
          <FloatingChat />
        </AuthProvider>

      </body>
    </html>
  )
}
