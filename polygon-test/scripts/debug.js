const hre = require("hardhat");

async function main() {
    const contractAddress = "0x2A3059b568b7020b04B4f49cd3320AD19c9FcDde";
    
    const FroggersNFT = await hre.ethers.getContractAt("FroggersNFT", contractAddress);
    
    try {
        console.log("🐸 === FROGGERS NFT DEBUG ===");
        console.log("📍 Contract:", contractAddress);
        console.log("🔗 PolygonScan:", `https://polygonscan.com/address/${contractAddress}`);
        console.log("");
        
        console.log("🏷️  Name:", await FroggersNFT.name());
        console.log("🔤 Symbol:", await FroggersNFT.symbol());
        console.log("📊 Total Supply:", await FroggersNFT.totalSupply().then(n => n.toString()));
        console.log("");
        
        console.log("🔗 Base URI:", await FroggersNFT.baseURI());
        console.log("");
        
        // Token 0 prüfen
        try {
            console.log("🎨 Token URI 0:", await FroggersNFT.tokenURI(0));
            console.log("👤 Owner of Token 0:", await FroggersNFT.ownerOf(0));
        } catch (e) {
            console.log("❌ Token 0:", e.message);
        }
        
        // Token 1 prüfen  
        try {
            console.log("🎨 Token URI 1:", await FroggersNFT.tokenURI(1));
        } catch (e) {
            console.log("❌ Token 1:", e.message);
        }
        
    } catch (error) {
        console.error("❌ Contract Fehler:", error.message);
    }
}

main().catch(console.error);