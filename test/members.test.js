const catchRevert = require("./exceptionsHelpers.js").catchRevert
const Members = artifacts.require("./Members.sol")

contract('Members', function (accounts) {

  const owner = accounts[0]
  const alice = accounts[1]
  const bob = accounts[2]

  beforeEach(async () => {
    instance = await Members.new()
  })

  it("should set and return the correct quorumPercentage", async () => {
    const newQuorumPerc = 80;
    await instance.setQuorumPercentage(newQuorumPerc);
    const perc = await instance.quorumPercentage({ from: alice })
    assert.equal(perc, newQuorumPerc, `QuorumPercentage incorrect, should be ${newQuorumPerc}, but is ${perc}`)
  })

  it("only allow owner to set the quorumPercentage", async () => {
    await catchRevert(instance.setQuorumPercentage(0, { from: alice }))
  })

  it("should add a new member", async () => {
    const isMemberBefore = await instance.members(alice)
    await instance.addMember(alice)
    const totalMembersAfter = await instance.totalMembers()
    const isMemberAfter = await instance.members(alice)
    assert.equal(isMemberBefore, false, "Alice already is a member!")
    assert.equal(isMemberAfter, true, "Alice dit not become a member!")
    assert.equal(totalMembersAfter, 1, "Total members not equal to 1!")
  })

  it("should not add a member who is already member", async () => {
    await instance.addMember(alice)
    await catchRevert(instance.addMember(alice))
  })

  it("only owner should be able to add a member", async () => {
    await catchRevert(instance.addMember(bob, { from: alice }))
  })

  it("should remove a new member", async () => {
    await instance.addMember(alice)
    const totalMembersBefore = await instance.totalMembers()
    const isMemberBefore = await instance.members(alice)
    await instance.removeMember(alice)
    const totalMembersAfter = await instance.totalMembers()
    const isMemberAfter = await instance.members(alice)
    assert.equal(totalMembersBefore, 1, "Total members before not equal to 1!")
    assert.equal(isMemberBefore, true, "Alice is not already a member!")
    assert.equal(isMemberAfter, false, "Alice was not removed as a member!")
    assert.equal(totalMembersAfter, 0, "Total members after not equal to 0!")
  })

  it("should not remove a member who is not already member", async () => {
    await catchRevert(instance.removeMember(alice))
  })

  it("only owner should be able to remove a member", async () => {
    await instance.addMember(alice);
    await catchRevert(instance.removeMember(alice, { from: bob }))
  })

  it("should return valid returns on quorumReached", async () => {
    await instance.addMember(owner)
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
    const quorumReached2of3 = await instance.quorumReached([owner, alice])
    const quorumReached3of3 = await instance.quorumReached([owner, alice, bob])
    assert.equal(quorumReached2of3, false, "incorrectly quorumReached for 1 out of 2 / 60%")
    assert.equal(quorumReached3of3, true, "incorrectly not quorumReached for 2 out of 2 / 60%")
  })
})
