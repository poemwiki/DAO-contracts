// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-ERC20PermitUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

// PoemWiki Reputation Token
contract PoemWikiReputation is
    Initializable,
    ERC20Upgradeable,
    OwnableUpgradeable,
    ERC20PermitUpgradeable,
    ERC20VotesUpgradeable
{
    function initialize(string memory _name, string memory _symbol)
        public
        initializer
    {
        __ERC20_init(_name, _symbol);
        __Ownable_init();
        __ERC20Permit_init(_name);
        __ERC20Votes_init();
        _mint(msg.sender, 50 * 10**decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function batchMint(address[] memory toArray, uint256[] memory amountArray)
        public
        onlyOwner
    {
        require(
            toArray.length == amountArray.length,
            "Input arrays length not equal"
        );
        require(toArray.length >= 1, "Input arrays length less than 1");
        require(toArray.length <= 1000, "Input arrays too long");

        for (uint256 i = 0; i < toArray.length; i++) {
            mint(toArray[i], amountArray[i]);
        }
    }

    function mintAndApprove(address spender, uint256 amount) public onlyOwner {
        _mint(owner(), amount);
        approve(spender, amount);
    }

    function batchTransferFrom(
        address from,
        address[] memory toArray,
        uint256[] memory amountArray
    ) public virtual returns (bool) {
        require(from == owner(), "Token transfer from non-owner");
        require(
            toArray.length == amountArray.length,
            "Input arrays length not equal"
        );
        require(toArray.length <= 1000, "Addresses array too long");

        address spender = _msgSender();
        for (uint256 i = 0; i < toArray.length; i++) {
            _spendAllowance(from, spender, amountArray[i]);
            _transfer(from, toArray[i], amountArray[i]);
        }
        return true;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20Upgradeable) {
        require(
            from == owner() || from == address(0),
            "Token transfer from non-owner"
        );

        super._beforeTokenTransfer(from, to, amount);
    }

    // The following functions are overrides required by Solidity.

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20Upgradeable, ERC20VotesUpgradeable) {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount)
        internal
        override(ERC20Upgradeable, ERC20VotesUpgradeable)
    {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount)
        internal
        override(ERC20Upgradeable, ERC20VotesUpgradeable)
    {
        super._burn(account, amount);
    }
}
