const TeamDao = artifacts.require("TeamDao.sol");

module.exports = function (deployer) {
  deployer.deploy(TeamDao, 100);
};
