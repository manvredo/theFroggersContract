// 📦 Imports
const { expect } = require("chai");
const { ethers } = require("hardhat");

// 📂 Test Suite: FroggersNFT Contract
describe("FroggersNFT", function () {
  let contract;

  // 🔧 Setup für jeden Test
  beforeEach(async function () {
    const FroggersFactory = await ethers.getContractFactory("FroggersNFT");
    const hiddenUri = "ipfs://hidden-uri";

    contract = await FroggersFactory.deploy(hiddenUri); // ✅ Kein .deployed() nötig
  });

  // 🧪 Test: hiddenURI sollte korrekt gesetzt sein
  it("soll das hiddenURI korrekt setzen", async function () {
    const expectedURI = "ipfs://hidden-uri";
    expect(await contract.hiddenURI()).to.equal(expectedURI);
  });

  // 🧠 Weitere Tests ...
});
