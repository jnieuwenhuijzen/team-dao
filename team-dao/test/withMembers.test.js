const catchRevert = require("./exceptionsHelpers.js").catchRevert
const TestHelperWithMembers = artifacts.require("./testHelpers/TestHelperWithMembers.sol")

contract('TestHelperWithMembers', function (accounts) {

  const owner = accounts[0]
  const alice = accounts[1]
  const bob = accounts[2]
  const charlie = accounts[3]

  beforeEach(async () => {
    instance = await TestHelperWithMembers.new()
  })

  it("should have the msg.sender as member", async () => {
    const isMember = await instance.isMember(owner);
    assert.equal(isMember, true, "Creator should be a member!")
  })

  it("should set and return the correct quorumPercentage", async () => {
    const newQuorumPerc = 80;
    await instance.setQuorumPercentage(newQuorumPerc);
    const perc = await instance.quorumPercentage({ from: alice })
    assert.equal(perc, newQuorumPerc, `QuorumPercentage incorrect, should be ${newQuorumPerc}, but is ${perc}`)
  })

  it("should add a new member", async () => {
    await instance.addMember(alice)
    const isMember = await instance.isMember(alice);
    const totalMembers = await instance.totalMembers();
    assert.equal(isMember, true, "Alice dit not become a member!")
    assert.equal(totalMembers, 2, "Incorrect amount of members")
  })

  it("should not add a member who is already member", async () => {
    await instance.addMember(alice)
    await catchRevert(instance.addMember(alice))
  })

  it("should remove a 'in the middle' member", async () => {
    await instance.addMember(alice)
    await instance.addMember(bob)
    await instance.removeMember(alice)
    const totalMembers = await instance.totalMembers()
    const aliceIsMemberAfter = await instance.isMember(alice)
    const bobIsMemberAfter = await instance.isMember(bob)
    assert.equal(aliceIsMemberAfter, false, "Alice was not removed as a member!")
    assert.equal(bobIsMemberAfter, true, "Bob was removed as a member!")
    assert.equal(totalMembers, 2, "Total members after not equal to 0!")
  })

  it("should remove a 'last' member", async () => {
    await instance.addMember(alice)
    await instance.addMember(bob)
    await instance.removeMember(bob)
    const totalMembers = await instance.totalMembers()
    const aliceIsMemberAfter = await instance.isMember(alice)
    const bobIsMemberAfter = await instance.isMember(bob)
    assert.equal(bobIsMemberAfter, false, "Alice was not removed as a member!")
    assert.equal(aliceIsMemberAfter, true, "Bob was removed as a member!")
    assert.equal(totalMembers, 2, "Total members after not equal to 2!")
  })

  it("should not remove a member who is not already member", async () => {
    await catchRevert(instance.removeMember(alice))
  })

  it("should return valid returns on quorumReached", async () => {
    await instance.addMember(alice)
    await instance.addMember(bob)
    const quorumReached0of3 = await instance.quorumReached([])
    const quorumReached1of3 = await instance.quorumReached([owner])
    const quorumReached2of3 = await instance.quorumReached([owner, alice])
    const quorumReached3of3 = await instance.quorumReached([owner, alice, bob])
    assert.equal(quorumReached0of3, false, "incorrectly quorumReached for 0 out of 3 / 60%")
    assert.equal(quorumReached1of3, false, "incorrectly quorumReached for 1 out of 3 / 60%")
    assert.equal(quorumReached2of3, true, "incorrectly not quorumReached for 2 out of 3 / 60%")
    assert.equal(quorumReached3of3, true, "incorrectly not quorumReached for 3 out of 3 / 60%")
  })

  it("should ignore non-members in quorummembers when calling quorumReached", async () => {
    await instance.addMember(bob)
    await instance.addMember(alice)
    const quorumReached2of3 = await instance.quorumReached([charlie, alice])
    const quorumReached3of3 = await instance.quorumReached([charlie, alice, bob])
    assert.equal(quorumReached2of3, false, "incorrectly quorumReached for 1 out of 3 / 60%")
    assert.equal(quorumReached3of3, true, "incorrectly not quorumReached for 2 out of 3 / 60%")
  })

  it("should recognize addresses as members", async () => {
    await instance.addMember(bob)
    await instance.addMember(alice)
    const ownerIsMember = await instance.isMember(owner)
    const bobIsMember = await instance.isMember(bob)
    const aliceIsMember = await instance.isMember(alice)
    const count = await instance.totalMembers()
    assert.equal(ownerIsMember, true, "owner not recognized as member")
    assert.equal(bobIsMember, true, "bob not recognized as member")
    assert.equal(aliceIsMember, true, "alice not recognized as member")
    assert.equal(count, 3, "incorrect count of totalMembers")
  })
})
