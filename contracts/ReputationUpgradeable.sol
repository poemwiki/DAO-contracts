// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-ERC20PermitUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

// PoemWiki Reputation Token
contract Reputation is
    Initializable,
    ERC20Upgradeable,
    OwnableUpgradeable,
    ERC20PermitUpgradeable,
    ERC20VotesUpgradeable
{
    event MintAndApprove(address spender, uint256 amount);

    function initialize(string calldata _name, string calldata _symbol)
        public
        initializer
    {
        __ERC20_init(_name, _symbol);
        __Ownable_init();
        __ERC20Permit_init(_name);
        __ERC20Votes_init();
        _mint(
            0x92332AC26F1afAFc6cCFA0d93F5037F422b21720,
            5041300 * 10**decimals()
        ); // fan
        _mint(
            0x7342D503201e3fcC6cC08F0EFDa73bd3C3119A9a,
            2220000 * 10**decimals()
        ); // vico
        _mint(
            0xAD1a31DcD5eBf7EE8cA058EC5BFC948B67cb88ae,
            1533000 * 10**decimals()
        ); // Alina
        _mint(
            0x3aAfa1d5B0e81303D0A539773AC215b88F220fb6,
            1500000 * 10**decimals()
        ); // moontree
        _mint(
            0x8B638e1af852c81A0F844570A1f52207e7F0A1a5,
            360000 * 10**decimals()
        ); // Jeff
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function batchMint(
        address[] calldata toArray,
        uint256[] calldata amountArray
    ) external onlyOwner {
        require(
            toArray.length == amountArray.length,
            "Input arrays length not equal"
        );
        require(toArray.length >= 1, "Input arrays length less than 1");
        require(toArray.length <= 1000, "Input arrays too long");

        for (uint256 i = 0; i < toArray.length; i++) {
            _mint(toArray[i], amountArray[i]);
        }
    }

    function mintAndApprove(address spender, uint256 amount)
        external
        onlyOwner
    {
        _mint(msg.sender, amount);
        _approve(msg.sender, spender, amount);
        emit MintAndApprove(spender, amount);
    }

    function batchTransferFrom(
        address from,
        address[] calldata toArray,
        uint256[] calldata amountArray
    ) external virtual returns (bool) {
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
