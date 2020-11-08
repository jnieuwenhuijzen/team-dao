const VoterToken = artifacts.require("VoterToken.sol");
const WithMembers = artifacts.require("WithMembers.sol");

module.exports = function (deployer) {
  deployer.deploy(VoterToken, '', 0, 0);
  deployer.deploy(WithMembers);
};
