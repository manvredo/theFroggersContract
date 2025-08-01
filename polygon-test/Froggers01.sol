// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract FroggersNFT is ERC721A, Ownable {
    // 🐸 Supply & Config
    uint256 public maxSupply = 5555;
    uint256 public mintPrice = 0.02 ether;
    bool public paused = true;
    bool public revealed = false;

    // 🧪 Sale-Status
    bool public presaleActive = false;
    bool public publicSaleActive = false;

    // 🧪 URIs
    string public baseURI;
    string public hiddenURI;

    // 🌿 MerkleRoot für Whitelist
    bytes32 public merkleRoot;

    // 👥 Mint-Tracking
    mapping(address => uint256) public minted;

    constructor(string memory _hiddenURI) ERC721A("FroggersNFT", "FROG") Ownable(msg.sender) {
        hiddenURI = _hiddenURI;
        baseURI = "https://thefrogger.myfilebase.com/ipfs/QmZ1MMmBjTGig84VaZKr1FYxoMepyQHGb4wuJxYWyi9vns/";
    }

    // 🔍 tokenURI mit Reveal-Logik
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        if (!revealed) {
            return hiddenURI;
        }
        return string(abi.encodePacked(baseURI, _toString(tokenId), ".json"));
    }

    // 🎟️ Public Mint
    function mint(uint256 amount) external payable {
        require(!paused, "Minting is paused");
        require(totalSupply() + amount <= maxSupply, "Max supply reached");
        require(msg.value >= mintPrice * amount, "Insufficient ETH");

        minted[msg.sender] += amount;
        _safeMint(msg.sender, amount);
    }

    // ⚙️ Admin-Funktionen
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

    function setMintPrice(uint256 _price) external onlyOwner {
        mintPrice = _price;
    }

    function setMerkleRoot(bytes32 _root) external onlyOwner {
        merkleRoot = _root;
    }

    // 🧪 Sale-Status togglen mit gegenseitigem Ausschluss
    function togglePresale() external onlyOwner {
        presaleActive = !presaleActive;
        if (presaleActive) {
            publicSaleActive = false;
        }
    }

    function togglePublicSale() external onlyOwner {
        publicSaleActive = !publicSaleActive;
        if (publicSaleActive) {
            presaleActive = false;
        }
    }

    // 💸 Auszahlung
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    // 🌿 Whitelist-Verifizierung über MerkleProof
    function verifyMerkleProof(bytes32[] calldata proof, address account) public view returns (bool) {
        return MerkleProof.verify(proof, merkleRoot, keccak256(abi.encodePacked(account)));
    }
}