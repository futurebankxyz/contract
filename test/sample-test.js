const { expect } = require("chai");

const FBT = value => ethers.utils.parseEther(`${value}`)

describe("FUTURE", function() {
  const [wallet, walletTo] = waffle.provider.getWallets();

  let future;
  let managerFuture;

  beforeEach(async () => {
    const FUTURE = await ethers.getContractFactory("FUTURE");
    const ManagerFuture = await ethers.getContractFactory("ManagerFuture");

    future = await FUTURE.deploy();
    await future.deployed();
    managerFuture = await ManagerFuture.deploy(future.address);
    await managerFuture.deployed();

    const minterRole = await future.MINTER_ROLE();
    await future.grantRole(minterRole, managerFuture.address);
    await managerFuture.mint(FBT(4));
  });

  it("sets deployer as admin", async function() {
    const adminRole = await future.DEFAULT_ADMIN_ROLE();
    const isSenderAdmin = await future.hasRole(adminRole, wallet.address);
    
    expect(isSenderAdmin).to.be.true;
  });

  it("sets deployer as admin", async function() {
    await expect(managerFuture.transfer(walletTo.address, FBT(5)))
      .to.be.revertedWith('SafeERC20: low-level call failed');

    await managerFuture.transfer(walletTo.address, FBT(3));
    
    expect(await future.balanceOf(walletTo.address)).to.equal(FBT(3));
    expect(await future.balanceOf(managerFuture.address)).to.equal(FBT(1));
  });
});