const Migrations = artifacts.require("VoterToken.sol");

module.exports = function (deployer) {
  deployer.deploy(VoterToken);
};
