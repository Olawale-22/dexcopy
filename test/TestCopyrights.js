// const Copyrights = artifacts.require("Copyrights");

// contract("Copyrights", (accounts) => {
//   it("should register a copyright", async () => {
//     const instance = await Copyrights.deployed();
//     await instance.registerCopyright("My Project", { from: accounts[0] });
//     const copyright = await instance.getCopyright(0);
//     assert.equal(copyright[0], "My Project");
//     assert.equal(copyright[1], accounts[0]);
//   });

//   it("should transfer a copyright", async () => {
//     const instance = await Copyrights.deployed();
//     await instance.registerCopyright("Another Project", { from: accounts[0] });
//     await instance.transferCopyright(1, accounts[1], { from: accounts[0] });
//     const copyright = await instance.getCopyright(1);
//     assert.equal(copyright[1], accounts[1]);
//   });
// });

const Copyrights = artifacts.require("Copyrights");

contract("Copyrights", (accounts) => {
  it("should register a copyright", async () => {
    const instance = await Copyrights.deployed();
    await instance.registerCopyright("My Project", { from: accounts[0] });
    const copyright = await instance.getCopyright(0);
    assert.equal(copyright[0], "My Project");
    assert.equal(copyright[1], accounts[0]);
  });

  it("should transfer a copyright", async () => {
    const instance = await Copyrights.deployed();
    await instance.registerCopyright("My Project", { from: accounts[0] });
    await instance.transferCopyright(0, accounts[1], { from: accounts[0] });
    const copyright = await instance.getCopyright(0);
    assert.equal(copyright[1], accounts[1]);
  });
});