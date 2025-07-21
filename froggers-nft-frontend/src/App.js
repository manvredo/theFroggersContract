import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import FroggersABI from "./Froggers01.json"; // Stelle sicher, dass du die ABI hier reinkopierst
import "./App.css";

const CONTRACT_ADDRESS = "0x80D971EE6Dd8dC8681a061584bac9158fb62e851"; // Deine aktuelle Adresse
const IPFS_GATEWAY = "https://ipfs.filebase.io/ipfs/";

function App() {
  const [frogs, setFrogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNFTs = async () => {
    try {
      if (!window.ethereum) {
        alert("Bitte installiere MetaMask");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, FroggersABI, signer);

      const totalSupply = await contract.totalSupply();
      const nftList = [];

      for (let i = 0; i < Number(totalSupply); i++) {
        const tokenUri = await contract.tokenURI(i);
        const metadataUrl = ipfsToHttp(tokenUri);

        const res = await fetch(metadataUrl);
        const metadata = await res.json();

        const imageUrl = ipfsToHttp(metadata.image);

        nftList.push({
          id: i,
          name: metadata.name || `Frog #${i}`,
          image: imageUrl,
        });
      }

      setFrogs(nftList);
    } catch (err) {
      console.error("Fehler beim Laden der NFTs:", err);
    } finally {
      setLoading(false);
    }
  };

  const ipfsToHttp = (ipfsUrl) => {
    if (!ipfsUrl.startsWith("ipfs://")) return ipfsUrl;
    return ipfsUrl.replace("ipfs://", IPFS_GATEWAY);
  };

  useEffect(() => {
    fetchNFTs();
  }, []);

  return (
    <div className="App">
      <h1>🐸 Froggers NFT Galerie</h1>
      {loading ? (
        <p>🔄 Lade NFTs oder verbinde MetaMask...</p>
      ) : (
        <div className="gallery">
          {frogs.map((frog) => (
            <div key={frog.id} className="nft-card">
              <img src={frog.image} alt={frog.name} />
              <p>{frog.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;

