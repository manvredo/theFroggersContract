'use client'

import { WagmiProvider } from 'wagmi'
import { wagmiConfig } from '@/lib/wagmiConfig'

export default function WagmiWrapper({ children }: { children: React.ReactNode }) {
  return <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
}


