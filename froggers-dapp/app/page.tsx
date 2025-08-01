'use client';

import { useState, useEffect } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { injected } from '@wagmi/connectors';

import FroggersViewer from '@/components/FroggersViewer';
import MintControls from '@/components/MintControls';
import PresaleMint from '@/components/PresaleMint';
import { getProofForAddress } from '@/utils/getMerkleProof';
import proofs from '@/data/proofs.json';

type ProofMap = {
  root: string;
  [address: string]: { proof: string[] } | string;
};

const typedProofs = proofs as ProofMap;
const merkleRoot = typedProofs.root as string;

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect, isLoading: connectLoading } = useConnect();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  const userProof = isConnected && address ? getProofForAddress(address) ?? [] : [];

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">🐸 Froggers NFT Minting</h1>

      {isClient && !isConnected ? (
        <button
          onClick={() => connect({ connector: injected() })}
          disabled={connectLoading}
          className="btn-primary mb-2"
        >
          {connectLoading ? '🔄 Verbinde...' : '🔐 Mit MetaMask verbinden'}
        </button>
      ) : (
        <>
          <MintControls />
          <PresaleMint merkleRoot={merkleRoot} userProof={userProof} />
          <FroggersViewer userProof={userProof} />
        </>
      )}
    </main>
  );
}