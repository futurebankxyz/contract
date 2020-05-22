const bre = require("@nomiclabs/buidler");

async function main() {
  const FUTURE = await ethers.getContractFactory("FUTURE");
  const ManagerFuture = await ethers.getContractFactory("ManagerFuture");

  const future = await FUTURE.deploy();
  await future.deployed();
  const managerFuture = await ManagerFuture.deploy(future.address);
  await managerFuture.deployed();

  console.log("FutureToken deployed to:", future.address);
  console.log("ManagerFuture deployed to:", managerFuture.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });