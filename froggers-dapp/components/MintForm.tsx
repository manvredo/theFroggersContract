'use client';

import { useState, useEffect } from 'react';
import { getProofForAddress } from '@/utils/getMerkleProof';
import { useSaleToggle } from '@/hooks/useSaleToggle';
// Optional: wagmi / viem Contract Call imports

export default function MintForm({ address }: { address: string }) {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const { presaleActive, publicSaleActive } = useSaleToggle();

  useEffect(() => {
    setStatus('');
  }, [address]);

  const handleMint = async () => {
    setLoading(true);
    setStatus('⏳ Preparing mint...');

    try {
      if (presaleActive) {
        const proof = getProofForAddress(address);

        if (!proof || proof.length === 0) {
          setStatus('🚫 You are not on the whitelist.');
          setLoading(false);
          return;
        }

        // Contract Call for presaleMint
        // await writeContract({ address: ..., functionName: 'presaleMint', args: [proof], account: address })

        setTimeout(() => {
          setStatus('✅ Presale mint successful!');
          setLoading(false);
        }, 1500);

        return;
      }

      if (publicSaleActive) {
        // Contract Call for publicMint
        // await writeContract({ address: ..., functionName: 'publicMint', args: [1], account: address })

        setTimeout(() => {
          setStatus('✅ Public mint successful!');
          setLoading(false);
        }, 1500);

        return;
      }

      setStatus('🔒 No active sale at the moment.');
    } catch (err) {
      console.error('[MintForm] ❌ Mint error:', err);
      setStatus('❌ Minting failed.');
    } finally {
      setLoading(false);
    }
  };

  const getSaleLabel = () => {
    if (presaleActive) return 'Presale active – whitelist required';
    if (publicSaleActive) return 'Public sale active – anyone can mint';
    return 'No sale active – waiting for launch';
  };

  return (
    <div className="p-6 border rounded bg-white text-glibberGray shadow-lg flex flex-col gap-4 items-center">
      <h2 className="text-lg font-semibold">🐸 Mint your Frogger</h2>
      <p className="text-sm font-mono text-center">{address}</p>

      <p className="text-sm text-green-700 bg-green-100 px-3 py-2 rounded">
        {getSaleLabel()}
      </p>

      <button
        onClick={handleMint}
        disabled={loading}
        className="bg-frogGreen text-white px-6 py-2 rounded hover:brightness-110 disabled:opacity-50"
      >
        {loading ? 'Croaking...' : 'Start mint'}
      </button>

      {status && (
        <p className="mt-2 text-sm text-center text-frogGreen animate-fadeIn">
          {status}
        </p>
      )}
    </div>
  );
}