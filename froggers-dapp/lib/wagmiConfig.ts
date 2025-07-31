import { createConfig, http } from 'wagmi';
import { sepolia } from 'wagmi/chains';

// Optional: Hole RPC-URL aus deiner .env-Datei
// z. B. via dotenv (falls du möchtest)
// import dotenv from 'dotenv';
// dotenv.config();

export const wagmiConfig = createConfig({
  chains: [sepolia],
  transports: {
    // Du kannst hier deine eigene RPC-URL einfügen:
    [sepolia.id]: http(
      process.env.SEPOLIA_RPC_URL || 'https://rpc-sepolia.example.com'
    ),
  },
  ssr: false, // SSR deaktiviert → Stabilität mit Turbopack & browser-only APIs
});


