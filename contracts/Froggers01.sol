// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol"; // MerkleProof importiert

contract FroggersNFT is ERC721A, Ownable {
    // 🐸 Supply und Konfiguration
    uint256 public maxSupply = 5555;
    uint256 public mintPrice = 0.02 ether;
    bool public paused = true;
    bool public revealed = false;

    // 🧪 Neue Sale-Flags
    bool public presaleActive = false;
    bool public publicSaleActive = false;

    // 🧪 URIs
    string public baseURI;
    string public hiddenURI;

    // 🌿 Merkle Root sichtbar für Dapp & Scripts
    bytes32 public merkleRoot;

    // 👥 Mint-Tracking
    mapping(address => uint256) public minted;

    constructor(string memory _hiddenURI) ERC721A("FroggersNFT", "FROG") Ownable(msg.sender) {
        hiddenURI = _hiddenURI;
        baseURI = "https://vertical-plum-alligator.myfilebase.com/ipfs/QmPoMcpNTFk7UKCQT1fg8cUzdm4u41mjMnakyHjTaQPHhL/";
    }

    // 🧭 Basis-URI
    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    // 🔍 tokenURI: Platzhalter oder echte JSON
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        if (!revealed) {
            return hiddenURI;
        }
        return string(abi.encodePacked(baseURI, _toString(tokenId), ".json"));
    }

    // 🎟️ Öffentliche Mint-Funktion
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

    // 🧪 Toggle Presale/PublicSale – korrigierte Logik
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

    // 🌿 Optional: MerkleProof-Verifizierung für Allowlist
    function verifyMerkleProof(bytes32[] calldata proof, address account) public view returns (bool) {
        return MerkleProof.verify(proof, merkleRoot, keccak256(abi.encodePacked(account)));
    }
}