// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Froggers01 is ERC721A, Ownable {
    string public baseTokenURI;
    uint256 public constant MAX_SUPPLY = 10000;

    constructor(string memory _baseTokenURI) ERC721A("Froggers 01", "FROG01") Ownable(msg.sender) {
    baseTokenURI = _baseTokenURI;
    }

    function mint(address to, uint256 quantity) external onlyOwner {
        require(totalSupply() + quantity <= MAX_SUPPLY, "Max supply exceeded");
        _mint(to, quantity);
    }

    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }

    function setBaseURI(string memory newBaseURI) external onlyOwner {
        baseTokenURI = newBaseURI;
    }
}


