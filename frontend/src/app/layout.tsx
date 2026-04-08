import '../styles/globals.css'
import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const metadata: Metadata = {
  title: 'RUDRA OS | Sentient Canvas',
  description: 'An intelligent multi-agent operating system for life management.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn("dark", inter.variable, spaceGrotesk.variable)}>
      <body className="min-h-screen font-sans antialiased bg-background text-white selection:bg-primary/30 selection:text-primary">
        {children}
      </body>
    </html>
  )
}
