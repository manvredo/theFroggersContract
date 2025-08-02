const hre = require("hardhat");

async function main() {
    const contractAddress = "0x2A3059b568b7020b04B4f49cd3320AD19c9FcDde";
    
    // Contract ABI anzeigen
    const contractFactory = await hre.ethers.getContractFactory("FroggersNFT");
    const contract = contractFactory.attach(contractAddress);
    
    console.log("🔍 Verfügbare Funktionen:");
    console.log("========================");
    
    const iface = contract.interface;
    const functions = Object.keys(iface.functions);
    
    functions.forEach(func => {
        if (func.toLowerCase().includes('mint')) {
            console.log(`✅ MINT-Funktion: ${func}`);
        }
    });
    
    console.log("\n📋 Alle Funktionen:");
    functions.forEach(func => {
        console.log(`- ${func}`);
    });
}

main().catch(console.error);