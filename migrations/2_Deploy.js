const VotingToken = artifacts.require("VotingToken.sol");
const WithMembers = artifacts.require("WithMembers.sol");

module.exports = function (deployer) {
  deployer.deploy(VotingToken, '', 0, 0);
  deployer.deploy(WithMembers);
};
