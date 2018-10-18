pragma solidity ^0.4.19;

import './FIFSRegistrar.sol';
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';


contract HarvestRegistrar is FIFSRegistrar,Ownable{

    function setOwner(bytes32 node, address owner) onlyOwner public{
        ens.setOwner(node,owner);
    }
    function setSubnodeOwner(bytes32 node, bytes32 label, address owner) onlyOwner public{
        ens.setSubnodeOwner(node,label,owner);
    }
    function setResolver(bytes32 node, address resolver) onlyOwner public{
        ens.setResolver(node,resolver);
    }
    function setTTL(bytes32 node, uint64 ttl) onlyOwner public{
        ens.setTTL(node,ttl);
    }
}
