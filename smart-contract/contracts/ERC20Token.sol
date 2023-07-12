pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERC20TokenCreation is ERC20, Ownable {
    constructor(uint _maxTotalSupply, string memory _name, string memory _symbol) ERC20(_name, _symbol) {
        _mint(address(this), _maxTotalSupply * 10 ** decimals());
    }

    function mint(address _receiver, uint _amount) public onlyOwner {
        require(balanceOf(address(this)) >= _amount, "Max total supply reach!");
        _transfer(address(this), _receiver, _amount);
    }
}