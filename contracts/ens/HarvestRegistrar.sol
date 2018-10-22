pragma solidity ^0.4.19;

import './FIFSRegistrar.sol';
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';


contract HarvestRegistrar is FIFSRegistrar,Ownable{

    event OwnerChanged(bytes32 indexed subnode, address indexed oldOwner, address indexed newOwner);


    constructor(AbstractENS _ensAddr, bytes32 _node) FIFSRegistrar(_ensAddr,_node) public {
        ens = _ensAddr;
        rootNode = _node;
    }

    function setOwner(bytes32 _node, address _owner) onlyOwner public{
        ens.setOwner(_node,_owner);
    }
    function setSubnodeOwner(bytes32 _node, bytes32 _label, address _owner) onlyOwner public{
        ens.setSubnodeOwner(_node,_label,_owner);
    }
    function setResolver(bytes32 _node, address _resolver) onlyOwner public{
        ens.setResolver(_node,_resolver);
    }
    function setTTL(bytes32 _node, uint64 _ttl) onlyOwner public{
        ens.setTTL(_node,_ttl);
    }

    function transfer(string _subdomain, address _newOwner) public {
        require(_newOwner != address(0));
        bytes32 subnode = keccak256(rootNode, keccak256(_subdomain));
        address currentOwner = ens.owner(subnode);

        require(currentOwner == msg.sender);

        if (ens.owner(rootNode) == address(this)) {
            ens.setSubnodeOwner(rootNode, subnode, _newOwner);
            emit OwnerChanged(subnode,currentOwner,_newOwner);
        }
    }

    function query(string _subdomain) public view returns (address){
        bytes32 subnode = keccak256(rootNode, keccak256(_subdomain));
        return ens.owner(subnode);
    }




}
