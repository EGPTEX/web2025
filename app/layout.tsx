import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/hooks/use-cart"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Web3 Store",
  description: "A Web3 product store with MetaMask login and ERC20 token payments",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <CartProvider>
            {children}
            <Toaster />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'