require('dotenv').config();
const { ethers } = require('ethers');

// Use the WORKING contract from your .env (not paused!)
const CONTRACT_ADDRESS = "0x74d76fab0330636De59A8CcB0D1692977fDbC1eF";
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = process.env.RPC_URL || "https://polygon-rpc.com";

// ABI for basic minting
const contractABI = [
    "function mint(uint256 amount) external payable",
    "function getCurrentPrice() public view returns (uint256)",
    "function getPriceForAmount(uint256 amount) public view returns (uint256)",
    "function paused() public view returns (bool)",
    "function publicSaleActive() public view returns (bool)",
    "function totalSupply() public view returns (uint256)",
    "function maxSupply() public view returns (uint256)",
    "function minted(address) public view returns (uint256)",
    "function maxPerWallet() public view returns (uint256)"
];

async function mintNFT() {
    try {
        console.log("🚀 MINTING WITH WORKING CONTRACT");
        console.log("=".repeat(40));
        
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
        
        console.log(`🟢 Account: ${wallet.address}`);
        console.log(`📍 Contract: ${CONTRACT_ADDRESS}`);
        
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, wallet);
        
        // Check contract status
        console.log("\n🔍 CONTRACT STATUS:");
        const paused = await contract.paused();
        const publicSaleActive = await contract.publicSaleActive();
        const totalSupply = await contract.totalSupply();
        const maxSupply = await contract.maxSupply();
        const currentPrice = await contract.getCurrentPrice();
        const userMinted = await contract.minted(wallet.address);
        const maxPerWallet = await contract.maxPerWallet();
        
        console.log(`   - Paused: ${paused}`);
        console.log(`   - Public Sale: ${publicSaleActive}`);
        console.log(`   - Supply: ${totalSupply}/${maxSupply}`);
        console.log(`   - Current Price: ${ethers.formatEther(currentPrice)} MATIC`);
        console.log(`   - Your Minted: ${userMinted}/${maxPerWallet}`);
        
        // Check if minting is possible
        if (paused) {
            console.log("❌ Contract is paused!");
            return;
        }
        
        if (!publicSaleActive) {
            console.log("❌ Public sale is not active!");
            return;
        }
        
        // Mint parameters
        const amountToMint = 1; // Start with 1 NFT
        console.log(`\n💰 MINTING ${amountToMint} NFT...`);
        
        // Get exact price
        let totalCost;
        try {
            totalCost = await contract.getPriceForAmount(amountToMint);
            console.log(`   - Exact cost: ${ethers.formatEther(totalCost)} MATIC`);
        } catch (e) {
            // Fallback to current price * amount
            totalCost = currentPrice * BigInt(amountToMint);
            console.log(`   - Estimated cost: ${ethers.formatEther(totalCost)} MATIC`);
        }
        
        // Check wallet balance
        const balance = await provider.getBalance(wallet.address);
        console.log(`   - Your balance: ${ethers.formatEther(balance)} MATIC`);
        
        if (balance < totalCost) {
            console.log("❌ Insufficient balance!");
            return;
        }
        
        console.log("\n📤 Sending mint transaction...");
        
        // Send transaction
        const tx = await contract.mint(amountToMint, {
            value: totalCost,
            gasLimit: 200000
        });
        
        console.log(`📨 TX Hash: ${tx.hash}`);
        console.log(`🔗 PolygonScan: https://polygonscan.com/tx/${tx.hash}`);
        console.log("⏳ Waiting for confirmation...");
        
        const receipt = await tx.wait();
        
        if (receipt.status === 1) {
            console.log("\n🎉 MINT SUCCESSFUL!");
            console.log(`⛽ Gas used: ${receipt.gasUsed.toString()}`);
            console.log(`💸 Cost: ${ethers.formatEther(totalCost)} MATIC`);
            
            // Get new status
            const newSupply = await contract.totalSupply();
            const newUserMinted = await contract.minted(wallet.address);
            console.log(`📊 New supply: ${newSupply}/${maxSupply}`);
            console.log(`🐸 Your NFTs: ${newUserMinted}`);
            
        } else {
            console.log("❌ Transaction failed!");
        }
        
    } catch (error) {
        console.error("❌ ERROR:", error.message);
        
        if (error.message.includes("Insufficient ETH")) {
            console.log("💡 Try with more MATIC or check the price");
        } else if (error.message.includes("max per wallet")) {
            console.log("💡 You've reached the maximum NFTs per wallet");
        }
    }
}

mintNFT();