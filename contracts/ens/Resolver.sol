pragma solidity ^0.4.17;



/**
 * @dev A basic interface for ENS resolvers.
 */
contract Resolver {
    event AddrChanged(bytes32 indexed node, address a);
    event ContentChanged(bytes32 indexed node, bytes32 hash);

    ENS ens;
    mapping(bytes32=>address) addresses;

    modifier only_owner(bytes32 node) {
        if(ens.owner(node) != msg.sender) throw;
        _;
    }

    constructor(address ensAddr) {
        ens = ENS(ensAddr);
    }

    function addr(bytes32 node) constant returns (address) {
        return addresses[node];
    }

    function setAddr(bytes32 node, address addr) only_owner(node) {
        addresses[node] = addr;
        AddrChanged(node, addr);
    }

    function supportsInterface(bytes4 interfaceID) constant returns (bool) {
        return interfaceID == 0x3b3b57de || interfaceID == 0x01ffc9a7;
    }

    function() {
        throw;
    }
}
