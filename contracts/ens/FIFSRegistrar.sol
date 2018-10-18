pragma solidity ^0.4.19;
import './AbstractENS.sol';

contract FIFSRegistrar {

    AbstractENS public ens;

    bytes32 public rootNode;

    constructor(AbstractENS ensAddr, bytes32 node) public {
        ens = ensAddr;
        rootNode = node;
    }

    function register(bytes32 subnode, address owner) public {
        bytes32 node = sha3(rootNode, subnode);
        address currentOwner = ens.owner(node);

        if (currentOwner != 0 && currentOwner != msg.sender) throw;

        ens.setSubnodeOwner(rootNode, subnode, owner);
    }
}
