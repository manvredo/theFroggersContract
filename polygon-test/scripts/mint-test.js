const hre = require("hardhat");

async function main() {
    const contractAddress = "0x2A3059b568b7020b04B4f49cd3320AD19c9FcDde";
    const [deployer] = await hre.ethers.getSigners();
    
    const FroggersNFT = await hre.ethers.getContractAt("FroggersNFT", contractAddress);
    
    console.log("🐸 === FROGGERS MINTING ===");
    console.log("👤 Minter:", deployer.address);
    console.log("📊 Current Supply:", await FroggersNFT.totalSupply().then(n => n.toString()));
    console.log("💰 Current Price:", hre.ethers.formatEther(await FroggersNFT.getCurrentPrice()), "MATIC");
    console.log("🔓 Public Sale Active:", await FroggersNFT.publicSaleActive());
    console.log("");
    
    // Owner Mint (kostenlos als Owner)
    try {
        console.log("🚀 Owner Mint: 5 Token...");
        const tx = await FroggersNFT.ownerMint(deployer.address, 5);
        console.log("⏳ Transaction:", tx.hash);
        await tx.wait();
        console.log("✅ Owner Mint erfolgreich!");
        
        console.log("📊 New Supply:", await FroggersNFT.totalSupply().then(n => n.toString()));
        
    } catch (error) {
        console.error("❌ Owner Mint Fehler:", error.message);
        
        // Fallback: Regular Mint mit Payment
        try {
            console.log("🚀 Fallback: Regular Mint 1 Token...");
            const price = await FroggersNFT.getCurrentPrice();
            const tx = await FroggersNFT.mint(1, { value: price });
            await tx.wait();
            console.log("✅ Regular Mint erfolgreich!");
        } catch (e) {
            console.error("❌ Regular Mint auch fehlgeschlagen:", e.message);
        }
    }
}

main().catch(console.error);