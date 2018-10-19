pragma solidity ^0.4.19;
import './AbstractENS.sol';

contract FIFSRegistrar {

    event NewRegistration(bytes32 indexed rootNode, string subdomain, address indexed owner);

    AbstractENS public ens;

    bytes32 public rootNode;

    constructor(AbstractENS _ensAddr, bytes32 _node) public {
        ens = _ensAddr;
        rootNode = _node;
    }

    function register(bytes32 _subnode, address _owner) public {
        require(_owner != address(0));
        bytes32 node = sha3(rootNode, _subnode);
        address currentOwner = ens.owner(node);

        if (currentOwner != 0 && currentOwner != msg.sender) throw;

        ens.setSubnodeOwner(rootNode, _subnode, _owner);

        emit NewRegistration(rootNode,_subnode,_owner);
    }
}
