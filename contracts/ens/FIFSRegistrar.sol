pragma solidity ^0.4.19;
import './ENS.sol';
import './Resolver.sol';

contract FIFSRegistrar {

    // namehash('eth')
    bytes32 constant public TLD_NODE = 0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae;

    event NewRegistration(bytes32 indexed rootNode, string subdomain, address indexed owner);

    ENS public ens;

    bytes32 public rootNode;

    Resolver public defaultResolver;

    constructor(ENS _ensAddr, string _name,Resolver _defaultResolver) public {
        require(_ensAddr != address(0) && _defaultResolver != address(0));
        ens = _ensAddr;
        bytes32 label = keccak256(abi.encodePacked(_name));
        rootNode = keccak256(abi.encodePacked(TLD_NODE, label));
        defaultResolver = _defaultResolver;
    }

    function register(string _subdomain, address _owner) internal {
        require(_owner != address(0));
        bytes32 subdomainLabel = keccak256(abi.encodePacked(_subdomain));
        require(ens.owner(keccak256(abi.encodePacked(rootNode, subdomainLabel))) == 0);
//        ens.setSubnodeOwner(rootNode, subdomainLabel, _owner);
        doRegistration(rootNode,subdomainLabel,_owner,defaultResolver);

        emit NewRegistration(rootNode,_subdomain,_owner);
    }

    function doRegistration(bytes32 _node, bytes32 _label, address _subdomainOwner, Resolver _resolver) internal {
        // Get the subdomain so we can configure it
        ens.setSubnodeOwner(_node, _label, this);

        bytes32 subnode = keccak256(abi.encodePacked(_node, _label));

        // Set the subdomain's resolver
        ens.setResolver(subnode, _resolver);

        // Set the address record on the resolver
        _resolver.setAddr(subnode, _subdomainOwner);

        // Pass ownership of the new subdomain to the registrant
        ens.setOwner(subnode, _subdomainOwner);
    }
}
