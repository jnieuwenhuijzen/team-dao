const catchRevert = require("./exceptionsHelpers.js").catchRevert
const TeamDao = artifacts.require("./TeamDao.sol")
const VotingToken = artifacts.require("./VotingToken.sol")


contract('TeamDao', function(accounts) {

  // There is not one owner, but members
  const alice = accounts[0]
  const bob = accounts[1]
  const charlie = accounts[2]

  const address0 = '0x0000000000000000000000000000000000000000'

  const option1 = '0x4f7074696f6e3100000000000000000000000000000000000000000000000000'
  const option2 = '0x4f7074696f6e3200000000000000000000000000000000000000000000000000'

  beforeEach(async () => {
    instance = await TeamDao.new(100)
  })

  it("should set a addMember proposal", async () => {
    await instance.proposeAddMember("myAddMember", 0, 0, bob)
    const result = await instance.getProposal(alice)
    assert.equal(result.quorum.length, 1, 'Could not propose addUser')
  });

  it("should set a vote proposal", async () => {
    votingOptions = [
      option1,
      option2
    ]
    await instance.proposeVote("myVote", 0, 0, votingOptions)
    const result = await instance.getProposal(alice)
    assert.equal(result.votingOptions.length, 2, 'expecting 2 votingOptions')
    assert.equal(result.votingOptions[0], option1, 'votingOption 1 not stored correct')
    assert.equal(result.votingOptions[1], option2, 'votingOption 2 not stored correct')
  });

  it("should not overwrite a proposal", async () => {
    await instance.proposeAddMember("My_proposal", 0, 0, bob)
    await catchRevert(instance.proposeAddMember("My_proposal", 0, 0, bob))
  });

  it("should remove a proposal", async () => {
    await instance.proposeAddMember("My_proposal", 0, 0, bob)
    await instance.removeProposal()
    const result = await instance.getProposal(alice)
    assert.equal(result.quorum.length, 0, 'Proposal not removed')
  });

  it("should only allow members to add a proposal", async () => {
    await catchRevert(instance.proposeAddMember("My_proposal", 0, 0, alice, {from: bob}))
  });

  it("should retrieve all proposal parameters", async () => {
    const name = "My_proposal"
    const proposalType = 1
    const startTime = 2
    const endTime = 3
    await instance.proposeAddMember(name, startTime, endTime, bob)
    const result = await instance.getProposal(alice)
    assert.equal(result.name, name, "Name not set in proposal")
    assert.equal(result.votingToken, address0, "Voting token address not correctly initialized in proposal")
    assert.equal(result.proposalType, proposalType, "ProposalType not set in proposal")
    assert.equal(result.quorum.length, 1, "quorum array not initialized in proposal")
    assert.equal(result.quorum[0], alice, "quorum array not initialized in proposal")
    assert.equal(result.startTime, startTime, "startTime not set in proposal")
    assert.equal(result.endTime, endTime, "endTime not set in proposal")
    assert.equal(result.payloadAddress, bob, "address not set correct")
    assert.equal(result.votingOptions.length, 0, "there should be 0 voting options")
  });

})
