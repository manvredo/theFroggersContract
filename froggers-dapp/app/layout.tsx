import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "@/styles/globals.css"

import QueryWrapper from "@/app/providers/QueryWrapper"
import WagmiWrapper from "@/app/providers/WagmiWrapper"

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans", display: "swap" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" })

export const metadata: Metadata = {
  title: "Froggers Mint Dapp",
  description: "Croak your NFT into existence!",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased bg-glibberGray text-white font-sans">
        <QueryWrapper>
          <WagmiWrapper>
            {children}
          </WagmiWrapper>
        </QueryWrapper>
      </body>
    </html>
  )
}
