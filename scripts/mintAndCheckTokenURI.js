const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0x2903d58C2ABb9737D44031176A8C69d60ee310E4";
  const recipient = "DEINE_WALLET_ADRESSE"; // ← hier deine Wallet-Adresse eintragen
  const tokenId = 0; // wir gehen davon aus, dass du den ersten Token mintest

  const FroggersNFT = await ethers.getContractAt("FroggersNFT", contractAddress);

  console.log(`🚀 Minting TokenID ${tokenId} an ${recipient}...`);
  const mintTx = await FroggersNFT.mint(recipient, 1);
  await mintTx.wait();
  console.log(`✅ Mint erfolgreich!`);

  console.log(`🔍 Lese tokenURI(${tokenId})...`);
  const uri = await FroggersNFT.tokenURI(tokenId);
  console.log(`📄 tokenURI(${tokenId}): ${uri}`);

  const ipfsHash = uri.replace("ipfs://", "");
  console.log(`🌐 IPFS Preview: https://ipfs.filebase.io/ipfs/${ipfsHash}`);
  console.log(`🧭 OpenSea: https://opensea.io/assets/matic/${contractAddress}/${tokenId}`);
}

main().catch((error) => {
  console.error("❌ Fehler beim Minten oder tokenURI-Abfrage:", error);
  process.exitCode = 1;
});

