const hre = require("hardhat");

async function main() {
    const contractAddress = "0x2A3059b568b7020b04B4f49cd3320AD19c9FcDde";
    const [deployer] = await hre.ethers.getSigners();
    
    const FroggersNFT = await hre.ethers.getContractAt("FroggersNFT", contractAddress);
    
    console.log("🐸 === FROGGERS FIX-ALL SCRIPT ===");
    console.log("👤 Account:", deployer.address);
    console.log("");
    
    // === SCHRITT 1: STATUS PRÜFEN ===
    console.log("📊 === AKTUELLER STATUS ===");
    const supply = await FroggersNFT.totalSupply();
    const revealed = await FroggersNFT.revealed();
    const publicSale = await FroggersNFT.publicSaleActive();
    
    console.log("📈 Total Supply:", supply.toString());
    console.log("👁️  Revealed:", revealed);
    console.log("🛒 Public Sale:", publicSale);
    console.log("🔗 Base URI:", await FroggersNFT.baseURI());
    console.log("");
    
    // === SCHRITT 2: MINT FALLS NÖTIG ===
    if (supply == 0) {
        console.log("🚀 === MINTING 5 TOKEN (OWNER MINT) ===");
        try {
            const tx = await FroggersNFT.ownerMint(deployer.address, 5);
            console.log("⏳ Transaction:", tx.hash);
            await tx.wait();
            console.log("✅ 5 Token geminted!");
        } catch (error) {
            console.error("❌ Owner Mint Fehler:", error.message);
        }
        console.log("");
    }
    
    // === SCHRITT 3: REVEAL AKTIVIEREN ===
    if (!revealed) {
        console.log("🔓 === REVEAL AKTIVIEREN ===");
        try {
            const tx = await FroggersNFT.reveal();
            console.log("⏳ Reveal Transaction:", tx.hash);
            await tx.wait();
            console.log("✅ Reveal aktiviert!");
        } catch (error) {
            console.error("❌ Reveal Fehler:", error.message);
        }
        console.log("");
    }
    
    // === SCHRITT 4: FINAL DEBUG ===
    console.log("🎯 === FINAL STATUS ===");
    const newSupply = await FroggersNFT.totalSupply();
    const newRevealed = await FroggersNFT.revealed();
    
    console.log("📈 Total Supply:", newSupply.toString());
    console.log("👁️  Revealed:", newRevealed);
    console.log("");
    
    if (newSupply > 0) {
        console.log("🎨 === TOKEN URIS TESTEN ===");
        try {
            console.log("🎨 Token URI 1:", await FroggersNFT.tokenURI(1));
            console.log("🎨 Token URI 2:", await FroggersNFT.tokenURI(2));
            console.log("👤 Owner Token 1:", await FroggersNFT.ownerOf(1));
        } catch (error) {
            console.error("❌ Token URI Fehler:", error.message);
        }
        console.log("");
    }
    
    console.log("🎉 === FERTIG! ===");
    console.log("✅ Deine NFTs sollten jetzt Metadaten und Bilder haben!");
    console.log(`🔗 PolygonScan: https://polygonscan.com/address/${contractAddress}`);
    console.log(`🖼️  OpenSea: https://opensea.io/assets/matic/${contractAddress}/1`);
}

main().catch(console.error);