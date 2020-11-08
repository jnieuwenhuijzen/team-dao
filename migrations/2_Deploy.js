const VoterToken = artifacts.require("VoterToken.sol");
const Members = artifacts.require("Members.sol");

module.exports = function (deployer) {
  deployer.deploy(VoterToken, '', 0, 0);
  deployer.deploy(Members);
};
