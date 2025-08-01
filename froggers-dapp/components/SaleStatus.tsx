'use client';

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import contractABI from './froggersAbi.json'; // Path to ABI file

const contractAddress = '0x2903d58C2ABb9737D44031176A8C69d60ee310E4';

export default function SaleStatus() {
  const [presaleActive, setPresaleActive] = useState(false);
  const [publicSaleActive, setPublicSaleActive] = useState(false);
  const [statusText, setStatusText] = useState('⏳ Loading sale status...');

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, contractABI, provider);

        const presale = await contract.presaleActive();
        const publicSale = await contract.publicSaleActive();

        setPresaleActive(presale);
        setPublicSaleActive(publicSale);

        if (presale) {
          setStatusText('🌿 Presale is live!');
        } else if (publicSale) {
          setStatusText('🚀 Public sale is live!');
        } else {
          setStatusText('🔒 No sale is active yet. Stay tuned!');
        }
      } catch (err) {
        console.error('Error fetching sale status:', err);
        setStatusText('❌ Failed to load sale status');
      }
    };

    fetchStatus();
  }, []);

  return (
    <div className="rounded-lg p-4 bg-green-100 border border-green-300 shadow-sm">
      <h2 className="text-lg font-semibold">📊 FroggersNFT Sale Status</h2>
      <p className="mt-2">{statusText}</p>
      <ul className="mt-2 text-sm">
        <li>🌿 Presale: {presaleActive ? '✅ active' : '❌ inactive'}</li>
        <li>🚀 Public Sale: {publicSaleActive ? '✅ active' : '❌ inactive'}</li>
      </ul>
    </div>
  );
}