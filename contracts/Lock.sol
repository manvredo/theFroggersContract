// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FroggersNFT is ERC721Enumerable, Ownable {
    uint256 public maxSupply = 1000;
    string public baseURI;
    string public hiddenURI;
    bool public revealed = false;

    constructor(string memory _hiddenURI) ERC721("Froggers", "FROG") {
        hiddenURI = _hiddenURI;
    }

    function mint(uint256 quantity) external {
        require(totalSupply() + quantity <= maxSupply, "Exceeds max supply");
        for (uint256 i = 0; i < quantity; i++) {
            _safeMint(msg.sender, totalSupply());
        }
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");

        if (!revealed) {
            return hiddenURI;
        }

        return string(abi.encodePacked(baseURI, Strings.toString(tokenId), ".json"));
    }

    function setBaseURI(string memory _uri) external onlyOwner {
        baseURI = _uri;
    }

    function setHiddenURI(string memory _uri) external onlyOwner {
        hiddenURI = _uri;
    }

    function reveal() external onlyOwner {
        revealed = true;
    }
}

