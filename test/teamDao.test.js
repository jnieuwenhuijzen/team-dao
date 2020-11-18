const catchRevert = require("./exceptionsHelpers.js").catchRevert
const TeamDao = artifacts.require("./TeamDao.sol")
const VotingToken = artifacts.require("./VotingToken.sol")


contract('TeamDao', function(accounts) {

  // There is not one owner, but members
  const alice = accounts[0]
  const bob = accounts[1]
  const charlie = accounts[2]

  const address0 = '0x0000000000000000000000000000000000000000'

  beforeEach(async () => {
    instance = await TeamDao.new(100)
  })

  it("should set a proposal", async () => {
    await instance.setProposal("My_proposal", 0, 0, 0)
    const result = await instance.getProposal(alice)
    assert.equal(result[3].length, 1, 'Could not set proposal')
  });

  it("should not overwrite a proposal", async () => {
    await instance.setProposal("My_proposal", 0, 0, 0)
    await catchRevert(instance.setProposal("My_proposal", 0, 0, 0))
  });

  it("should remove a proposal", async () => {
    await instance.setProposal("My_proposal1", 0, 0, 0)
    await instance.removeProposal()
    const result = await instance.getProposal(alice)
    assert.equal(result[3].length, 0, 'Proposal not removed')
  });

  it("should only allow members to add a proposal", async () => {
    await catchRevert(instance.setProposal("My_proposal", 0, 0, 0, {from: bob}))
  });

  it("should retrieve proposal parameters", async () => {
    const name = "My_proposal"
    const proposalType = 1
    const startTime = 2
    const endTime = 3
    await instance.setProposal(name, proposalType, startTime, endTime)
    const result = await instance.getProposal(alice)
    assert.equal(result[0], name, "Name not set in proposal")
    assert.equal(result[1], address0, "Address not correctly initialized in proposal")
    assert.equal(result[2], proposalType, "ProposalType not set in proposal")
    assert.equal(result[3].length, 1, "quorum array not initialized in proposal")
    assert.equal(result[3][0], alice, "quorum array not initialized in proposal")
    assert.equal(result[4], startTime, "startTime not set in proposal")
    assert.equal(result[5], endTime, "endTime not set in proposal")
  });

})
