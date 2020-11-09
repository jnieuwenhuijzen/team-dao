const catchRevert = require("./exceptionsHelpers.js").catchRevert
const TeamDao = artifacts.require("./TeamDao.sol")

contract('TeamDao', function(accounts) {

  const owner = accounts[0]
  const alice = accounts[1]
  const bob = accounts[2]

  beforeEach(async () => {
    instance = await TeamDao.new()
  })

  it("should return the correct number of teamMembers", async () => {
    const totalMembers = await instance.totalMembers({from: alice})
    assert.equal(totalMembers, 1, `Incorrect amount of initial team members`)
  });

})
