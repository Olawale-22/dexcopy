const Copyrights = artifacts.require("Copyrights");

contract("Copyrights", (accounts) => {
  it("should register a copyright", async () => {
    const instance = await Copyrights.deployed();
    await instance.registerCopyright("My Project", "Owner Name", "Description", { from: accounts[0] });
    const copyright = await instance.getCopyright(0);
    assert.equal(copyright.name, "My Project");
    assert.equal(copyright.owner, accounts[0]);
  });

  it("should not register a copyright with a duplicate name", async () => {
    const instance = await Copyrights.deployed();
    await instance.registerCopyright("My Project", "Owner Name", "Description", { from: accounts[0] });
    try {
      await instance.registerCopyright("My Project", "Another Owner", "Another Description", { from: accounts[1] });
      assert.fail("Expected revert not received");
    } catch (error) {
      assert(error.message.includes("revert"), "Expected revert, got " + error.message);
    }
  });

  it("should transfer a copyright", async () => {
    const instance = await Copyrights.deployed();
    await instance.registerCopyright("Another Project", "Owner Name", "Description", { from: accounts[0] });
    await instance.transferCopyright(1, accounts[1], { from: accounts[0] });
    const copyright = await instance.getCopyright(1);
    assert.equal(copyright.owner, accounts[1]);
  });
});