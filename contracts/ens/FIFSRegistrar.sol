pragma solidity ^0.4.19;
import './ENS.sol';

contract FIFSRegistrar {

    // namehash('eth')
    bytes32 constant public TLD_NODE = 0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae;

    event NewRegistration(bytes32 indexed rootNode, string subdomain, address indexed owner);

    ENS public ens;

    bytes32 public rootNode;

    constructor(ENS _ensAddr, string _name) public {
        ens = _ensAddr;
        bytes32 label = keccak256(_name);
        rootNode = keccak256(TLD_NODE, label);
    }

    function register(string _subdomain, address _owner) public {
        require(_owner != address(0));
        bytes32 subdomainLabel = keccak256(_subdomain);
        require(ens.owner(keccak256(rootNode, subdomainLabel)) == 0);
        ens.setSubnodeOwner(rootNode, subdomainLabel, _owner);

        emit NewRegistration(rootNode,_subdomain,_owner);
    }
}
