// 📦 Imports
const hre = require("hardhat"); // Zugriff auf hre.ethers
const { time, loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

// 📂 Test Suite: Lock Contract
describe("Lock", function () {
  // 🧪 Fixture für Deployment
  async function deployLockFixture() {
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

    // ✅ Kompatibel mit Ethers v6
    const lockedAmount = hre.ethers.parseEther("1");

    const [owner, otherAccount] = await hre.ethers.getSigners();
    const Lock = await hre.ethers.getContractFactory("Lock");
    const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

    return { lock, unlockTime, lockedAmount, owner, otherAccount };
  }

  // ✅ Test: Unlock-Zeit korrekt gesetzt
  it("Should set the right unlockTime", async function () {
    const { lock, unlockTime } = await loadFixture(deployLockFixture);
    expect(await lock.unlockTime()).to.equal(unlockTime);
  });

  // 🧠 Weitere Tests kannst du hier einbauen ...
});
