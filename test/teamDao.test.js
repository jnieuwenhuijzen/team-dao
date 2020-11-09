const catchRevert = require("./exceptionsHelpers.js").catchRevert
const TeamDao = artifacts.require("./TeamDao.sol")
const VoterToken = artifacts.require("./VoterToken.sol")


contract('TeamDao', function(accounts) {

  const owner = accounts[0]
  const alice = accounts[1]
  const bob = accounts[2]

  beforeEach(async () => {
    instance = await TeamDao.new()
  })

  it("should return the team members (the contract creator)", async () => {
    const member = await instance.members(0)
    const totalMembers = await instance.totalMembers()
    assert.equal(member, owner, `team member is not creator`)
    assert.equal(1, await instance.totalMembers(), `Incorrect initial team member`)
  });

})
