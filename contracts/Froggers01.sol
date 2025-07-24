// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract Froggers01 is ERC721A, Ownable {
    using MerkleProof for bytes32[];

    uint256 public constant MAX_SUPPLY = 10000;
    uint256 public constant PRESALE_PRICE = 0.005 ether;
    uint256 public constant PUBLIC_PRICE = 0.01 ether;

    bytes32 public merkleRoot;
    string public baseTokenURI;
    bool public presaleActive = true;
    bool public publicSaleActive = false;
    bool public revealed = false;

    mapping(address => uint256) public presaleMinted;

    constructor(string memory _initBaseURI, address initialOwner)
        ERC721A("Froggers01", "FROG")
        Ownable(initialOwner)
    {
        baseTokenURI = _initBaseURI;
    }

    function presaleMint(uint256 quantity, bytes32[] calldata proof) external payable {
        require(presaleActive, "Presale nicht aktiv");
        require(totalSupply() + quantity <= MAX_SUPPLY, "Max erreicht");

        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
        require(MerkleProof.verify(proof, merkleRoot, leaf), "Nicht auf Whitelist");
        require(presaleMinted[msg.sender] + quantity <= 2, "Presale-Limit erreicht");
        require(msg.value >= quantity * PRESALE_PRICE, "Nicht genug ETH");

        presaleMinted[msg.sender] += quantity;
        _mint(msg.sender, quantity);
    }

    function publicMint(uint256 quantity) external payable {
        require(publicSaleActive, "Public Sale nicht aktiv");
        require(totalSupply() + quantity <= MAX_SUPPLY, "Max erreicht");
        require(msg.value >= quantity * PUBLIC_PRICE, "Nicht genug ETH");

        _mint(msg.sender, quantity);
    }

    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }

    function setBaseURI(string memory _newBaseURI) external onlyOwner {
        baseTokenURI = _newBaseURI;
        revealed = true;
    }

    function setMerkleRoot(bytes32 _root) external onlyOwner {
        merkleRoot = _root;
    }

    function togglePresale() external onlyOwner {
        presaleActive = !presaleActive;
    }

    function togglePublicSale() external onlyOwner {
        publicSaleActive = !publicSaleActive;
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
