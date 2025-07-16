import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import './App.css';

const CONTRACT_ADDRESS = "0x80D971EE6Dd8dC8681a061584bac9158fb62e851";
const ABI = [
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function totalSupply() view returns (uint256)",
];

function App() {
  const [uris, setUris] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const loadNFTs = async () => {
      if (!window.ethereum) return alert("Bitte installiere MetaMask");

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

        const total = await contract.totalSupply();
        const uriList = [];

        for (let i = 0; i < Number(total); i++) {
          const uri = await contract.tokenURI(i);
          uriList.push(uri);
        }

        setUris(uriList);
        setConnected(true);
      } catch (err) {
        console.error("Fehler beim Laden der NFTs:", err);
      }
    };

    loadNFTs();
  }, []);

  return (
    <div className="App">
      <h1>🐸 Froggers NFT Galerie</h1>
      {!connected && <p>🔄 Lade NFTs oder verbinde MetaMask...</p>}
      <div className="gallery">
        {uris.map((uri, index) => (
          <div key={index} className="nft-card">
            <img src={uri.replace("ipfs://", "https://ipfs.io/ipfs/")} alt={`Frog #${index}`} />
            <p>Frog #{index}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

