// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract FroggersNFT is ERC721Enumerable, Ownable {
    uint256 public maxSupply = 1000;
    uint256 public presalePrice = 0.02 ether;
    uint256 public publicPrice = 0.03 ether;

    string public baseURI;
    string public hiddenURI;
    bool public revealed = false;

    bool public presaleActive = false;
    bool public publicSaleActive = false;

    bytes32 public merkleRoot;

    constructor(string memory _hiddenURI) ERC721("Froggers", "FROG") {
        hiddenURI = _hiddenURI;
    }

    // 🐸 PRESALE Mint (Whitelist)
    function presaleMint(uint256 quantity, bytes32[] calldata proof) external payable {
        require(presaleActive, "Presale inactive");
        require(isWhitelisted(msg.sender, proof), "Not whitelisted");
        require(msg.value >= presalePrice * quantity, "Insufficient ETH");
        require(totalSupply() + quantity <= maxSupply, "Exceeds max supply");

        for (uint256 i = 0; i < quantity; i++) {
            _safeMint(msg.sender, totalSupply());
        }
    }

    // 🚀 PUBLIC Mint (offen für alle)
    function publicMint(uint256 quantity) external payable {
        require(publicSaleActive, "Public sale inactive");
        require(msg.value >= publicPrice * quantity, "Insufficient ETH");
        require(totalSupply() + quantity <= maxSupply, "Exceeds max supply");

        for (uint256 i = 0; i < quantity; i++) {
            _safeMint(msg.sender, totalSupply());
        }
    }

    // 🔐 Whitelist prüfen via Merkle
    function isWhitelisted(address addr, bytes32[] calldata proof) public view returns (bool) {
        bytes32 leaf = keccak256(abi.encodePacked(addr));
        return MerkleProof.verify(proof, merkleRoot, leaf);
    }

    // 🖼️ Reveal & Metadata
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        return revealed
            ? string(abi.encodePacked(baseURI, Strings.toString(tokenId), ".json"))
            : hiddenURI;
    }

    // ✏️ Admin-Funktionen
    function setBaseURI(string memory _uri) external onlyOwner {
        baseURI = _uri;
    }

    function setHiddenURI(string memory _uri) external onlyOwner {
        hiddenURI = _uri;
    }

    function reveal() external onlyOwner {
        revealed = true;
    }

    function setMerkleRoot(bytes32 _root) external onlyOwner {
        merkleRoot = _root;
    }

    function togglePresale(bool active) external onlyOwner {
        presaleActive = active;
    }

    function togglePublicSale(bool active) external onlyOwner {
        publicSaleActive = active;
    }
}