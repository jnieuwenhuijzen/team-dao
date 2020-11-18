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

    // First proposal is immediately activated and removed, therefor add proposal,
    // then test the second
    await instance.proposeAddMember("test prepare", bob)
  })

  it("should set a addMember proposal", async () => {
    await instance.proposeAddMember("myAddMember", charlie)
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
    await instance.proposeAddMember("My_proposal", charlie)
    await catchRevert(instance.proposeAddMember("My_proposal", bob))
  });

  it("should remove a proposal", async () => {
    await instance.proposeAddMember("My_proposal", bob)
    await instance.removeProposal()
    const result = await instance.getProposal(alice)
    assert.equal(result.quorum.length, 0, 'Proposal not removed')
  });

  it("should only allow members to add a proposal", async () => {
    await catchRevert(instance.proposeAddMember("My_proposal", alice, {from: charlie}))
  });

  it("should retrieve all proposal parameters", async () => {
    const name = "My_proposal"
    const proposalType = 1
    const startTime = 2
    const endTime = 3
    await instance.proposeAddMember(name, charlie)
    const result = await instance.getProposal(alice)
    assert.equal(result.name, name, "Name not set in proposal")
    assert.equal(result.votingToken, address0, "Voting token address not correctly initialized in proposal")
    assert.equal(result.proposalType, proposalType, "ProposalType not set in proposal")
    assert.equal(result.quorum.length, 1, "quorum array not initialized in proposal")
    assert.equal(result.quorum[0], alice, "quorum array not initialized in proposal")
    assert.equal(result.startTime, 0, "startTime not set in proposal")
    assert.equal(result.endTime, 0, "endTime not set in proposal")
    assert.equal(result.payloadAddress, charlie, "address not set correct")
    assert.equal(result.votingOptions.length, 0, "there should be 0 voting options")
  });

  it("should execute addMember proposal immediately for second user", async () => {
    const totalMembers = await instance.totalMembers()
    member1 = await instance.members(0);
    member2 = await instance.members(1);
    assert.equal(totalMembers, 2, "total members should be equal to 2")
    assert.equal(member1, alice, "first member not equal to alice")
    assert.equal(member2, bob, "second member not equal to alice")
  });

  it("should not execute addMember proposal immediately for third user", async () => {
    await instance.proposeAddMember("Add Charlie!", charlie)
    const totalMembers = await instance.totalMembers()
    member1 = await instance.members(0);
    member2 = await instance.members(1);
    assert.equal(totalMembers, 2, "total members should be equal to 2")
    assert.equal(member1, alice, "first member not equal to alice")
    assert.equal(member2, bob, "second member not equal to alice")
  });

  it("should execute addMember proposal for third user after given support for vote", async () => {
    await instance.proposeAddMember("Add Charlie!", charlie, {from: alice})
    await instance.supportProposal(alice, {from: bob})
    const totalMembers = await instance.totalMembers()
    member1 = await instance.members(0);
    member2 = await instance.members(1);
    member3 = await instance.members(2);
    assert.equal(totalMembers, 3, "total members should be equal to 2")
    assert.equal(member1, alice, "first member not equal to alice")
    assert.equal(member2, bob, "second member not equal to alice")
    assert.equal(member3, charlie, "third member not equal to charlie")
  });

})
