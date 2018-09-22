pragma solidity ^0.4.24;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

contract Controlled is Ownable{

    /// @notice The address of the controller is the only address that can call
    ///  a function with this modifier
    modifier onlyController() {
        require(msg.sender == controller);
        _;
    }

    address public controller;

    constructor() public {
        controller = msg.sender;
    }

    /// @notice Changes the controller of the contract
    /// @param _newController The new controller of the contract
    function changeController(address _newController) onlyOwner public {
        controller = _newController;
    }
}
