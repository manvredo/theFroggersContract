const { ethers } = require("hardhat");

async function main() {
  // Signer abrufen
  const [deployer] = await ethers.getSigners();
  console.log("Minting mit Account:", deployer.address);

  // 🔒 Feste Contract-Adresse direkt hier eintragen:
  const contractAddress = "0xaEe9C8cB579AC1c6992d2Cf20e20Ba9842bd160"; // <- Ersetzen mit deiner tatsächlichen Adresse
  console.log("Contract-Adresse (fest):", contractAddress);

  // Contract holen – Contract-Namen korrekt setzen
  const nftContract = await ethers.getContractAt("FroggersNFT", contractAddress);

  // Anzahl der Tokens zum Minten
  const quantity = 1;

  // Mint-Preis abrufen und casten
  let mintPrice = await nftContract.mintPrice();
  if (!ethers.BigNumber.isBigNumber(mintPrice)) {
    mintPrice = ethers.BigNumber.from(mintPrice);
  }

  const totalCost = mintPrice.mul(quantity);

  console.log(`Mintpreis pro Token: ${ethers.utils.formatEther(mintPrice)} ETH`);
  console.log(`Gesamtpreis für ${quantity} Token(s): ${ethers.utils.formatEther(totalCost)} ETH`);

  // Mint-Transaktion ausführen
  const tx = await nftContract.mint(quantity, {
    value: totalCost
  });

  console.log("⏳ Mint-Transaktion gesendet. TX Hash:", tx.hash);
  await tx.wait();
  console.log("✅ Mint erfolgreich abgeschlossen!");
}

main().catch((error) => {
  console.error("❌ Fehler beim Mint:", error);
  process.exitCode = 1;
});