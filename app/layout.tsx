import type React from "react"
import type { Metadata } from "next"
import { Encode_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import { SiteFooter } from "@/components/site-footer"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const encodeSans = Encode_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Buscador de Establecimientos - Provincia de Buenos Aires",
  description: "Sistema de gestión de establecimientos educativos de la Provincia de Buenos Aires",
  generator: "v0.app",
  icons: {
    icon: "/favicon_dte.png",
    apple: "/favicon_dte.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${encodeSans.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          {children}
          <SiteFooter />
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
