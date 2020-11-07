const VoterToken = artifacts.require("VoterToken.sol");

module.exports = function (deployer) {
  deployer.deploy(VoterToken, '', 0, 0);
};
