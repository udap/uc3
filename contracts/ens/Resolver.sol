pragma solidity ^0.4.17;


import "./ENS.sol";
/**
 * @dev A basic interface for ENS resolvers.
 */
contract Resolver {
    event AddrChanged(bytes32 indexed node, address addr);
    event ContentChanged(bytes32 indexed node, bytes32 hash);

    ENS public ens;
    mapping(bytes32=>address) public addresses;

    modifier only_owner(bytes32 node) {
        require(ens.owner(node) == msg.sender);
        _;
    }

    constructor(address ensAddr) public {
        ens = ENS(ensAddr);
    }

    function addr(bytes32 node)  constant public returns (address) {
        return addresses[node];
    }

    function setAddr(bytes32 node, address addr) only_owner(node) public {
        addresses[node] = addr;
        emit AddrChanged(node, addr);
    }

    function supportsInterface(bytes4 interfaceID) pure external returns (bool) {
        return interfaceID == 0x3b3b57de || interfaceID == 0x01ffc9a7;
    }

    function() public{
        revert();
    }
}
