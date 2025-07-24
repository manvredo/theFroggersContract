const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Froggers01", function () {
  let Froggers, contract, owner, addr1;

  beforeEach(async () => {
    [owner, addr1] = await ethers.getSigners();
    Froggers = await ethers.getContractFactory("Froggers01");
    contract = await Froggers.deploy("ipfs://deineCID/metadata/");
  });

  it("soll den baseURI korrekt setzen", async () => {
    expect(await contract.baseTokenURI()).to.equal("ipfs://deineCID/metadata/");
  });

  it("mint() sollte nur vom Owner erlaubt sein", async () => {
    await expect(contract.connect(addr1).mint(addr1.address, 1))
      .to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("soll korrekt minten und tokenURI liefern", async () => {
    await contract.mint(addr1.address, 1);
    expect(await contract.totalSupply()).to.equal(1);
    expect(await contract.tokenURI(0)).to.equal("ipfs://deineCID/metadata/0.json");
  });

  it("soll die Max Supply einhalten", async () => {
    await expect(contract.mint(addr1.address, 10001))
      .to.be.revertedWith("Max supply exceeded");
  });
});
