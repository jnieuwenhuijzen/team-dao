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
    // First proposal is immediately activated and removed, therefor addMember proposal,
    // which is immediately executed (on majority) then test the second
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

  it("should create a voting token when proposal accepted", async () => {
    votingOptions = [
      option1,
      option2
    ]
    await instance.proposeVote("myVote", 0, 0, votingOptions)
    await instance.supportProposal(alice, {from: bob})
    const result = await instance.getProposal(alice)
    tokenInstance = await VotingToken.at(result.votingToken)
    const option1Address = await tokenInstance.votingAddresses(option1)
    const option2Address = await tokenInstance.votingAddresses(option2)
    const aliceBalance = await tokenInstance.balanceOf(alice)
    const bobBalance = await tokenInstance.balanceOf(bob)
    const storedOptions = await tokenInstance.getVotingOptions()
    assert.notEqual(option1Address, address0, 'option 1 address equal to 0')
    assert.notEqual(option2Address, address0, 'option 2 address equal to 0')
    assert.notEqual(option1Address, option2Address, 'option 1 address equals option 2 address')
    assert.equal(aliceBalance, 100, 'Alice has not 100 voting tokens')
    assert.equal(bobBalance, 100, 'Alice has not 100 voting tokens')
    assert.equal(storedOptions[0], option1, 'Option 1 not stored correct')
    assert.equal(storedOptions[1], option2, 'Option 2 not stored correct')
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

  it("should remove the 2nd member after approval", async () => {
    await instance.proposeRemoveMember("Remove Bob!", bob, { from: bob })
    await instance.supportProposal(bob, { from:alice })
    const totalMembers = await instance.totalMembers()
    member1 = await instance.members(0);
    assert.equal(totalMembers, 1, "total members should be equal to 1")
    assert.equal(member1, alice, "first member not equal to alice")
  });

  it("should not remove the last member", async () => {
    await instance.proposeRemoveMember("Remove Bob!", bob, { from: bob })
    await instance.supportProposal(bob, { from: alice })
    await catchRevert(instance.proposeRemoveMember("Remove Alice!", alice, { from: alice }))
  });

  it("should change quorum per proposal", async () => {
    await instance.proposeAddMember("Add Charlie!", charlie, { from: alice })
    await instance.supportProposal(alice, { from: bob })
    await instance.proposeSetQuorumPercentage("Set percentage to 90%", 90, { from: alice})
    await instance.supportProposal(alice, { from: bob })

    await instance.proposeRemoveMember("Remove Alice!", alice, { from: alice })
    await instance.supportProposal(alice, { from: bob })

    const totalMembers = await instance.totalMembers()
    assert.equal(totalMembers, 3, "total members should be equal to 3")
  });

  it("should set individual voting power", async () => {
    await instance.proposeSetIndividualVotingPower("Set bob's voting to 333!", bob, 333, { from: bob })
    await instance.supportProposal(bob, { from: alice })
    const votingPower = await instance.votingPower(bob)
    assert.equal(votingPower, 333, "Votingpower not expectde value")
  });

  it("should set default voting power", async () => {
    await instance.proposeSetDefaultVotingPower("Set default power to 5!", 5, { from: bob })
    await instance.supportProposal(bob, { from: alice })
    await instance.proposeAddMember("Add Charlie!", charlie)
    await instance.supportProposal(alice, {from: bob})
    const votingPower = await instance.votingPower(charlie)
    assert.equal(votingPower, 5, "Votingpower not expected value")
  });

  it("should set initial pauser to creator", async () => {
    const pauser = await instance.pauser();
    assert.equal(pauser, alice, "Initials pauser not equal to creator!");
  })

  it("should only allow pauser to pause the contract", async () => {
    await catchRevert(instance.pause({from: bob}));
  })

  it("should only allow pauser to unpause the contract", async () => {
    await catchRevert(instance.unpause({from: bob}));
  })

  it("should change pauser upon vote", async () => {
    await instance.proposeSetPauser("Set pauser to bob!", bob, {from: alice});
    await instance.supportProposal(alice, {from: bob});
    const pauser = await instance.pauser();
    assert.equal(pauser, bob, "Pauser not changed to bob!");
  })

  it("should pause the contract when paused", async () => {
    await instance.pause();
    await catchRevert(instance.proposeSetPauser("try and fail", bob, {from: alice}))
  })

  it("should unpause", async () => {
    await instance.pause();
    await instance.unpause();
    await instance.proposeSetPauser("try and succeed", bob, { from: alice });
    await instance.supportProposal(alice, { from: bob });
    const pauser = await instance.pauser();
    assert.equal(pauser, bob, "Pauser not changed to bob!");
  })
})
