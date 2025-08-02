const hre = require("hardhat");

async function main() {
    const contractAddress = "0x2A3059b568b7020b04B4f49cd3320AD19c9FcDde";
    
    const [deployer] = await hre.ethers.getSigners();
    console.log("🐸 Minting mit Account:", deployer.address);
    
    const FroggersNFT = await hre.ethers.getContractAt("FroggersNFT", contractAddress);
    
    try {
        console.log("📊 Aktueller Supply:", await FroggersNFT.totalSupply().then(n => n.toString()));
        
        // Mint erste 10 Token als Test
        console.log("🚀 Minte ersten Batch (10 Token)...");
        const tx = await FroggersNFT.mint(deployer.address, 10);
        console.log("⏳ Transaction gesendet:", tx.hash);
        
        await tx.wait();
        console.log("✅ Minting erfolgreich!");
        
        console.log("📊 Neuer Supply:", await FroggersNFT.totalSupply().then(n => n.toString()));
        console.log("🎨 Token URI 0:", await FroggersNFT.tokenURI(0));
        console.log("🎨 Token URI 1:", await FroggersNFT.tokenURI(1));
        
    } catch (error) {
        console.error("❌ Minting Fehler:", error.message);
        
        // Prüfe ob mint() Funktion existiert
        console.log("\n🔍 Verfügbare Funktionen checken...");
        // Versuche verschiedene Mint-Funktionen
        try {
            console.log("Versuche safeMint...");
            const tx = await FroggersNFT.safeMint(deployer.address);
            await tx.wait();
            console.log("✅ safeMint erfolgreich!");
        } catch (e) {
            console.log("❌ safeMint fehlgeschlagen:", e.message);
        }
    }
}

main().catch(console.error);