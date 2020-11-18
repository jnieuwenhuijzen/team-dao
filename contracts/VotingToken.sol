// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "./openzeppelin/ERC20Burnable.sol";
import "./openzeppelin/Ownable.sol";

/// @title A contract for tokenized voting
/// @author Jarl Nieuwenhuijzen
/// @notice This contract should be used in conjunction with team-dao
/// @dev This contract is based on openzeppelin ERC20 contracts with only transferring prerequisites added
/// @dev votingAddresses are created for each votingOption
contract VotingToken is ERC20Burnable, Ownable {
    uint256 public votingFrom;
    uint256 public votingUntil;
    bytes32[] public votingOptions;

    mapping (bytes32 => address) public votingAddresses;


    /// @notice Construct a standard ERC20 token, add voting timeframe
    /// @param name A name for this vote
    /// @param _votingFrom The unix timestamp start of the voting timeframe
    /// @param _votingUntil The unix timestamp end of the voting timeframe
    /// @param _votingOptions The options for which can be voted using this contract
    constructor(
        string memory name,
        uint256 _votingFrom,
        uint256 _votingUntil,
        bytes32[] memory _votingOptions
    ) public ERC20(name, "VOTE") {
        votingFrom = _votingFrom;
        votingUntil = _votingUntil;
        votingOptions = _votingOptions;

        for (uint i=0; i< votingOptions.length; i++) {
            votingAddresses[votingOptions[i]] = address(bytes20(keccak256(abi.encodePacked(address(this), i))));
        }
    }

    function getVotingOptions() public view returns(bytes32[] memory) {
        return votingOptions;
    }

    /// @notice In preparation of the vote, tokens are distributed (minted) to alleged voters
    /// @param account The address to whom the voting tokens will be assigned to
    /// @param amount The amount of voting tokens
    function mint(address account, uint256 amount) public onlyOwner {
        _mint(account, amount);
    }

    /// @notice The function _BeforeTokenTransfer is used to implement the prerequisites
    /// Transfer is only possible if the vote is in its voting period
    /// Transfer is only possible if the ownership is renounced (minting no longer possible)
    /// Minting is possible, until ownership is renounced
    /// Burning is always possible
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256
    ) internal override {
        if (from != address(0) && to != address(0)) {
            require(owner() == address(0), "Voting contract is still owned!");
            require(
                block.timestamp >= votingFrom,
                "Voting is not yet possible!"
            );
            require(
                block.timestamp <= votingUntil,
                "Voting is no longer possible!"
            );
        }
    }
}
