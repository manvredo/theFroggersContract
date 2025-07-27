// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FroggersPresale is ERC721A, Ownable {
    bytes32 public merkleRoot;
    mapping(address => bool) public hasMinted;

    constructor(address initialOwner)
        ERC721A("Froggers", "FRG")
        Ownable(initialOwner)
    {}

    function setMerkleRoot(bytes32 _root) external onlyOwner {
        merkleRoot = _root;
    }

    function presaleMint(bytes32[] calldata proof) external {
        require(!hasMinted[msg.sender], "Already minted");
        require(verify(proof, msg.sender), "Invalid proof");

        hasMinted[msg.sender] = true;

        _mint(msg.sender, 1); // Mintet 1 Token effizient mit ERC721A
    }

    function verify(bytes32[] calldata proof, address account) public view returns (bool) {
        bytes32 leaf = keccak256(abi.encodePacked(account));
        return verifyProof(proof, merkleRoot, leaf);
    }

    function verifyProof(
        bytes32[] memory proof,
        bytes32 root,
        bytes32 leaf
    ) internal pure returns (bool) {
        bytes32 computedHash = leaf;
        for (uint256 i = 0; i < proof.length; i++) {
            computedHash = computedHash <= proof[i]
                ? keccak256(abi.encodePacked(computedHash, proof[i]))
                : keccak256(abi.encodePacked(proof[i], computedHash));
        }
        return computedHash == root;
    }
}