// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract FroggersNFT is ERC721A, Ownable, ReentrancyGuard {
    // 🔢 Supply & Config
    uint256 public maxSupply = 5555;
    bool public paused = false;
    bool public revealed = false;
    
    // 🧪 Sale States
    bool public presaleActive = false;
    bool public publicSaleActive = true;
    
    // 💰 Dynamic Pricing Structure
    struct PriceTier {
        uint256 startSupply;
        uint256 endSupply;
        uint256 price;
    }
    
    PriceTier[] public priceTiers;
    
    // 🚀 Mint Limits
    uint256 public maxPerWallet = 10;
    uint256 public maxPerTransaction = 5;
    
    // 🖼 URI Management
    string public baseURI;
    string public hiddenURI;
    
    // 🌿 MerkleRoot for Whitelist
    bytes32 public merkleRoot;
    
    // 👥 Tracking minted amounts per wallet
    mapping(address => uint256) public minted;
    
    // 📊 Events
    event Minted(address indexed to, uint256 amount, uint256 totalCost);
    event PriceTierAdded(uint256 startSupply, uint256 endSupply, uint256 price);
    event PriceTierUpdated(uint256 index, uint256 startSupply, uint256 endSupply, uint256 price);
    event SaleStateChanged(bool presale, bool publicSale);
    
    constructor(string memory _hiddenURI) 
        ERC721A("FroggersNFT", "FROG") 
        Ownable(msg.sender) 
    {
        hiddenURI = _hiddenURI;
        baseURI = "https://thefrogger.myfilebase.com/ipfs/QmZ1MMmBjTGig84VaZKr1FYxoMepyQHGb4wuJxYWyi9vns/";
        
        // 🎯 Setup initial price tiers (example)
        _addPriceTier(0, 1000, 0.01 ether);     // First 1000: 0.01 ETH
        _addPriceTier(1001, 3000, 0.02 ether);  // Next 2000: 0.02 ETH
        _addPriceTier(3001, 5000, 0.03 ether);  // Next 2000: 0.03 ETH
        _addPriceTier(5001, 5555, 0.05 ether);  // Final 555: 0.05 ETH
    }
    
    // 🖼 Reveal Logic
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        
        if (!revealed) {
            return hiddenURI;
        }
        
        return string(abi.encodePacked(baseURI, _toString(tokenId), ".json"));
    }
    
    // 💰 Get Current Price Based on Supply
    function getCurrentPrice() public view returns (uint256) {
        uint256 currentSupply = totalSupply();
        
        for (uint256 i = 0; i < priceTiers.length; i++) {
            if (currentSupply >= priceTiers[i].startSupply && 
                currentSupply <= priceTiers[i].endSupply) {
                return priceTiers[i].price;
            }
        }
        
        // Fallback to last tier price if no tier matches
        if (priceTiers.length > 0) {
            return priceTiers[priceTiers.length - 1].price;
        }
        
        return 0.02 ether; // Default fallback
    }
    
    // 💰 Get Price for Specific Amount
    function getPriceForAmount(uint256 amount) public view returns (uint256 totalCost) {
        require(amount > 0, "Amount must be greater than 0");
        
        uint256 currentSupply = totalSupply();
        uint256 remainingAmount = amount;
        totalCost = 0;
        
        for (uint256 i = 0; i < priceTiers.length && remainingAmount > 0; i++) {
            PriceTier memory tier = priceTiers[i];
            
            if (currentSupply > tier.endSupply) {
                continue; // Skip this tier, we're past it
            }
            
            uint256 tierStart = currentSupply < tier.startSupply ? tier.startSupply : currentSupply;
            uint256 tierEnd = tier.endSupply;
            uint256 availableInTier = tierEnd - tierStart + 1;
            
            if (availableInTier > 0) {
                uint256 tokensFromThisTier = remainingAmount < availableInTier ? remainingAmount : availableInTier;
                totalCost += tokensFromThisTier * tier.price;
                remainingAmount -= tokensFromThisTier;
                currentSupply += tokensFromThisTier;
            }
        }
        
        require(remainingAmount == 0, "Not enough supply available");
    }
    
    // 🎟 Public Mint Function
    function mint(uint256 amount) external payable nonReentrant {
        require(!paused, "Minting is paused");
        require(publicSaleActive, "Public sale is not active");
        require(amount > 0, "Amount must be greater than 0");
        require(amount <= maxPerTransaction, "Exceeds max per transaction");
        require(totalSupply() + amount <= maxSupply, "Max supply reached");
        require(minted[msg.sender] + amount <= maxPerWallet, "Exceeds max per wallet");
        
        uint256 totalCost = getPriceForAmount(amount);
        require(msg.value >= totalCost, "Insufficient ETH");
        
        minted[msg.sender] += amount;
        _safeMint(msg.sender, amount);
        
        emit Minted(msg.sender, amount, totalCost);
        
        // Refund excess payment
        if (msg.value > totalCost) {
            payable(msg.sender).transfer(msg.value - totalCost);
        }
    }
    
    // 🎟 Presale Mint Function (Whitelist)
    function presaleMint(uint256 amount, bytes32[] calldata proof) external payable nonReentrant {
        require(!paused, "Minting is paused");
        require(presaleActive, "Presale is not active");
        require(amount > 0, "Amount must be greater than 0");
        require(amount <= maxPerTransaction, "Exceeds max per transaction");
        require(totalSupply() + amount <= maxSupply, "Max supply reached");
        require(minted[msg.sender] + amount <= maxPerWallet, "Exceeds max per wallet");
        require(verifyMerkleProof(proof, msg.sender), "Invalid whitelist proof");
        
        uint256 totalCost = getPriceForAmount(amount);
        require(msg.value >= totalCost, "Insufficient ETH");
        
        minted[msg.sender] += amount;
        _safeMint(msg.sender, amount);
        
        emit Minted(msg.sender, amount, totalCost);
        
        // Refund excess payment
        if (msg.value > totalCost) {
            payable(msg.sender).transfer(msg.value - totalCost);
        }
    }
    
    // 👑 Owner Mint (for team/giveaways)
    function ownerMint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= maxSupply, "Max supply reached");
        _safeMint(to, amount);
    }
    
    // 💰 Price Tier Management
    function addPriceTier(uint256 startSupply, uint256 endSupply, uint256 price) external onlyOwner {
        _addPriceTier(startSupply, endSupply, price);
    }
    
    function _addPriceTier(uint256 startSupply, uint256 endSupply, uint256 price) internal {
        require(startSupply <= endSupply, "Invalid supply range");
        require(endSupply <= maxSupply, "End supply exceeds max supply");
        
        priceTiers.push(PriceTier({
            startSupply: startSupply,
            endSupply: endSupply,
            price: price
        }));
        
        emit PriceTierAdded(startSupply, endSupply, price);
    }
    
    function updatePriceTier(uint256 index, uint256 startSupply, uint256 endSupply, uint256 price) external onlyOwner {
        require(index < priceTiers.length, "Invalid tier index");
        require(startSupply <= endSupply, "Invalid supply range");
        require(endSupply <= maxSupply, "End supply exceeds max supply");
        
        priceTiers[index] = PriceTier({
            startSupply: startSupply,
            endSupply: endSupply,
            price: price
        });
        
        emit PriceTierUpdated(index, startSupply, endSupply, price);
    }
    
    function removePriceTier(uint256 index) external onlyOwner {
        require(index < priceTiers.length, "Invalid tier index");
        
        // Move last element to the position to delete
        priceTiers[index] = priceTiers[priceTiers.length - 1];
        priceTiers.pop();
    }
    
    function getPriceTiersCount() external view returns (uint256) {
        return priceTiers.length;
    }
    
    function getAllPriceTiers() external view returns (PriceTier[] memory) {
        return priceTiers;
    }
    
    // 🔧 Admin Functions
    function setBaseURI(string memory _uri) external onlyOwner {
        baseURI = _uri;
    }
    
    function setHiddenURI(string memory _uri) external onlyOwner {
        hiddenURI = _uri;
    }
    
    function reveal() external onlyOwner {
        revealed = true;
    }
    
    function pause(bool _state) external onlyOwner {
        paused = _state;
    }
    
    function setMaxSupply(uint256 _maxSupply) external onlyOwner {
        require(_maxSupply >= totalSupply(), "Cannot set below current supply");
        maxSupply = _maxSupply;
    }
    
    function setMaxPerWallet(uint256 _maxPerWallet) external onlyOwner {
        maxPerWallet = _maxPerWallet;
    }
    
    function setMaxPerTransaction(uint256 _maxPerTransaction) external onlyOwner {
        maxPerTransaction = _maxPerTransaction;
    }
    
    function setMerkleRoot(bytes32 _root) external onlyOwner {
        merkleRoot = _root;
    }
    
    // 🧪 Toggle Sale States
    function togglePresale() external onlyOwner {
        presaleActive = !presaleActive;
        if (presaleActive) {
            publicSaleActive = false;
        }
        emit SaleStateChanged(presaleActive, publicSaleActive);
    }
    
    function togglePublicSale() external onlyOwner {
        publicSaleActive = !publicSaleActive;
        if (publicSaleActive) {
            presaleActive = false;
        }
        emit SaleStateChanged(presaleActive, publicSaleActive);
    }
    
    function setSaleState(bool _presaleActive, bool _publicSaleActive) external onlyOwner {
        require(!(_presaleActive && _publicSaleActive), "Cannot have both sales active");
        presaleActive = _presaleActive;
        publicSaleActive = _publicSaleActive;
        emit SaleStateChanged(presaleActive, publicSaleActive);
    }
    
    // 💸 Withdraw Contract Balance
    function withdraw() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }
    
    // 🔍 View Functions
    function tokensOfOwner(address owner) external view returns (uint256[] memory) {
        unchecked {
            uint256 tokenIdsIdx;
            address currOwnershipAddr;
            uint256 tokenIdsLength = balanceOf(owner);
            uint256[] memory tokenIds = new uint256[](tokenIdsLength);
            TokenOwnership memory ownership;
            for (uint256 i = _startTokenId(); tokenIdsIdx != tokenIdsLength; ++i) {
                ownership = _ownershipAt(i);
                if (ownership.burned) {
                    continue;
                }
                if (ownership.addr != address(0)) {
                    currOwnershipAddr = ownership.addr;
                }
                if (currOwnershipAddr == owner) {
                    tokenIds[tokenIdsIdx++] = i;
                }
            }
            return tokenIds;
        }
    }
    
    function numberMinted(address owner) external view returns (uint256) {
        return _numberMinted(owner);
    }
    
    function getContractInfo() external view returns (
        uint256 _totalSupply,
        uint256 _maxSupply,
        uint256 _currentPrice,
        bool _paused,
        bool _revealed,
        bool _presaleActive,
        bool _publicSaleActive,
        uint256 _maxPerWallet,
        uint256 _maxPerTransaction
    ) {
        return (
            totalSupply(),
            maxSupply,
            getCurrentPrice(),
            paused,
            revealed,
            presaleActive,
            publicSaleActive,
            maxPerWallet,
            maxPerTransaction
        );
    }
    
    // ✅ Whitelist Verification
    function verifyMerkleProof(bytes32[] calldata proof, address account) public view returns (bool) {
        return MerkleProof.verify(proof, merkleRoot, keccak256(abi.encodePacked(account)));
    }
    
    // 🎯 Starting token ID (ERC721A override)
    function _startTokenId() internal view virtual override returns (uint256) {
        return 1;
    }
}