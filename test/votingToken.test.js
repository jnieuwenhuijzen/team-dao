const catchRevert = require("./exceptionsHelpers.js").catchRevert
const VotingToken = artifacts.require("./VotingToken.sol")

contract('VotingToken', function(accounts) {

  const owner = accounts[0]
  const alice = accounts[1]
  const bob = accounts[2]

  const tokenName = 'TestToken'
  const tokenSymbol = 'VOTE'
  const mintAmount = 314
  const burnAmount = 200
  const transferAmount = 100

  const unixNow = Math.floor(Date.now() / 1000)

  beforeEach(async () => {
    instance = await VotingToken.new(tokenName, unixNow, unixNow + 1000)
  })

  it("should return the correct name of the token", async () => {
    const name = await instance.name({from: alice})
    assert.equal(name, tokenName, `Name of the contract is incorrect, should be initialized with ${tokenName}`)
  });

  it("should return the correct symbol of the token", async () => {
    const symbol = await instance.symbol({from: alice })
    assert.equal(symbol, tokenSymbol, `Symbol of the token is incorrect, should be ${tokenSymbol}, but is ${symbol}`)
  });

  it("should mint a given amount of token to a given address.", async () => {
    await instance.mint(alice, mintAmount)
    await instance.renounceOwnership()
    const balance = await instance.balanceOf(alice)
    assert.equal(balance, mintAmount, 'Minted amount is incorrect')
  });

  it("should not be able to mint after having renounced ownership of the contract.", async () => {
    await instance.renounceOwnership()
    await catchRevert(instance.mint(alice, mintAmount, {from: owner}))
  });

  it("should burn a given amount of token.", async () => {
    await instance.mint(owner, mintAmount)
    await instance.renounceOwnership()
    await instance.burn(burnAmount)

    const balance = await instance.balanceOf(owner)
    assert.equal(balance, mintAmount - burnAmount, 'Mint - Burn amount is incorrect')
  });

  it("should transfer from address to address.", async () => {
    await instance.mint(owner, mintAmount)
    await instance.renounceOwnership()
    await instance.transfer(alice, transferAmount)

    const balanceOwner = await instance.balanceOf(owner)
    const balanceAlice = await instance.balanceOf(alice)
    assert.equal(balanceOwner, mintAmount - transferAmount, 'Transferred amount for owner is incorrect' + tokenName)
    assert.equal(balanceAlice, transferAmount, 'Transferred amount for alice is incorrect' + tokenName)
  });

  it("should not transfer from address to address if not renouncedOwnership.", async () => {
    await instance.mint(owner, mintAmount)
    await catchRevert(instance.transfer(alice, transferAmount))
  });

  it("should not transfer from address to address if not valid yet.", async () => {
    instance = await VotingToken.new(tokenName, unixNow + 100, unixNow + 1000)
    await instance.mint(owner, mintAmount)
    await instance.renounceOwnership()
    await catchRevert(instance.transfer(alice, transferAmount))
  });

  it("should not transfer from address to address if voting expired.", async () => {
    instance = await VotingToken.new(tokenName, unixNow -100, unixNow - 10)
    await instance.mint(owner, mintAmount)
    await instance.renounceOwnership()
    await catchRevert(instance.transfer(alice, transferAmount))
  });
})
