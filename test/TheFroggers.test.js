const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Froggers01 Contract", function () {
  let Froggers, froggers;
  let owner, addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    Froggers = await ethers.getContractFactory("Froggers01");
    froggers = await Froggers.deploy("ipfs://example_base_uri/");

    // Kein froggers.deployed() nötig
  });

  it("soll den richtigen Namen und Symbol haben", async function () {
    expect(await froggers.name()).to.equal("Froggers 01");
    expect(await froggers.symbol()).to.equal("FROG01");
  });

  it("soll den baseTokenURI korrekt speichern", async function () {
    expect(await froggers.baseTokenURI()).to.equal("ipfs://example_base_uri/");
  });

  it("soll nur vom Owner gemintet werden können", async function () {
    // addr1 versucht zu minten -> es soll fehlschlagen mit custom error (nicht Ownable standard)
    await expect(
      froggers.connect(addr1).mint(addr1.address, 1)
    ).to.be.revertedWithCustomError(froggers, "OwnableUnauthorizedAccount");
  });

  it("soll die Maximalanzahl nicht überschreiten", async function () {
    // Owner mintet die max. Anzahl -> sollte klappen
    await froggers.mint(owner.address, 10000);

    // Ein weiterer mint sollte fehlschlagen
    await expect(
      froggers.mint(owner.address, 1)
    ).to.be.revertedWith("Max supply exceeded");
  });
});

