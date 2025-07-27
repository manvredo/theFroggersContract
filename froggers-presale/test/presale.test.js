const { expect } = require("chai");
const { ethers } = require("hardhat");
const keccak256 = require("keccak256");
const { MerkleTree } = require("merkletreejs");

describe("🐸 FroggersPresale - presaleMint()", function () {
  let contract;
  let whitelist;
  let tree;
  let root;
  let owner, whitelistedUser, nonWhitelisted;

  before(async () => {
    [owner, whitelistedUser, nonWhitelisted] = await ethers.getSigners();

    const Froggers = await ethers.getContractFactory("FroggersPresale");
    contract = await Froggers.deploy(owner.address); // Übergabe des initialOwner
    await contract.deployed();

    // Whitelist-Accounts (echte Testadresse verwenden!)
    whitelist = [whitelistedUser.address];

    // Merkle Tree vorbereiten
    const leaves = whitelist.map(addr => keccak256(addr));
    tree = new MerkleTree(leaves, keccak256, { sortPairs: true });

    root = tree.getHexRoot();
    await contract.setMerkleRoot(root);
  });

  it("✅ erlaubt mint für whitelisted user", async () => {
    const leaf = keccak256(whitelistedUser.address);
    const proof = tree.getHexProof(leaf);

    await expect(contract.connect(whitelistedUser).presaleMint(proof))
      .to.emit(contract, "Transfer") // optional, falls Mint-Event vorhanden
      .withArgs(whitelistedUser.address, 0); // Beispiel-TokenId, je nach Mint-Logik anpassen
  });

  it("❌ lehnt nicht-whitelisted user ab", async () => {
    const fakeLeaf = keccak256(nonWhitelisted.address);
    const fakeProof = tree.getHexProof(fakeLeaf); // absichtlich falsch

    await expect(contract.connect(nonWhitelisted).presaleMint(fakeProof))
      .to.be.revertedWith("Invalid proof");
  });
});