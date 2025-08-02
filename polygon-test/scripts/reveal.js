const hre = require("hardhat");

async function main() {
    const contractAddress = "0x2A3059b568b7020b04B4f49cd3320AD19c9FcDde";
    
    const FroggersNFT = await hre.ethers.getContractAt("FroggersNFT", contractAddress);
    
    console.log("🐸 === FROGGERS REVEAL ===");
    console.log("🔍 Revealed Status:", await FroggersNFT.revealed());
    
    if (!(await FroggersNFT.revealed())) {
        console.log("🚀 Aktiviere Reveal...");
        const tx = await FroggersNFT.reveal();
        await tx.wait();
        console.log("✅ Reveal aktiviert!");
    }
    
    // Test Token URI
    const supply = await FroggersNFT.totalSupply();
    if (supply > 0) {
        console.log("🎨 Token URI 1:", await FroggersNFT.tokenURI(1));
    }
}

main().catch(console.error);