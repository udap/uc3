pragma solidity ^0.4.24;


import "./ENS.sol";
/**
 * @dev A basic interface for ENS resolvers.
 */
contract Resolver {
    event AddrChanged(bytes32 indexed node, address addr);
    event ContentChanged(bytes32 indexed node, bytes32 hash);

    ENS public ens;
    mapping(bytes32=>address) public addresses;

    modifier only_owner(bytes32 _node) {
        require(ens.owner(_node) == msg.sender);
        _;
    }

    constructor(ENS _ensAddr) public {
        ens = _ensAddr;
    }

    function addr(bytes32 _node)  view public returns (address) {
        return addresses[_node];
    }

    function setAddr(bytes32 _node, address _addr) only_owner(_node) public {
        addresses[_node] = _addr;
        emit AddrChanged(_node, _addr);
    }

    function supportsInterface(bytes4 _interfaceID) pure external returns (bool) {
        return _interfaceID == 0x3b3b57de || _interfaceID == 0x01ffc9a7;
    }

    function() public{
        revert();
    }
}
