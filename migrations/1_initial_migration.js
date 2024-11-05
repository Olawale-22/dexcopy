const Copyrights = artifacts.require("Copyrights");

module.exports = async function (deployer) {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Add a delay of 1 second
  await deployer.deploy(Copyrights);
};