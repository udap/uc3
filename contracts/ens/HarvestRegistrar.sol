pragma solidity ^0.4.24;

import './FIFSRegistrar.sol';
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import 'openzeppelin-solidity/contracts/token/ERC20/DetailedERC20.sol';
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import './ENS.sol';
import './Resolver.sol';
import 'openzeppelin-solidity/contracts/ECRecovery.sol';

contract HarvestRegistrar is FIFSRegistrar,Ownable{

    using SafeMath for uint256;

    using ECRecovery for bytes32;


    struct Fee {
        DetailedERC20 token;
        uint256 amount;
    }

    Fee public fees;

    // Mapping from ERC20Token to amount
    mapping(address => uint256) public ownedTokens;

    // Mapping from caller to nonce
    mapping(address => uint256) public nonces;

    event OwnerChanged(bytes32 indexed _label,string indexed _subdomain,address indexed _oldOwner, address indexed _newOwner);


    constructor(ENS _ens, string _name,Resolver _defaultResolver) FIFSRegistrar(_ens,_name,_defaultResolver) public {
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

    function transfer(address _caller,bytes32 _label,string _subdomain, address _newOwner,bytes _sig) public {

        bytes32 hash = keccak256(abi.encodePacked(address(this),nonces[_caller],_label,_subdomain,_newOwner));
        require(hash.recover(_sig) == _caller);
        require(_newOwner != address(0));
        bytes32 domainNode = keccak256(abi.encodePacked(TLD_NODE, _label));
        bytes32 subdomainLabel = keccak256(abi.encodePacked(_subdomain));
        address currentOwner = ens.owner(keccak256(abi.encodePacked(domainNode,subdomainLabel)));

        require(currentOwner == _caller);

        //fees
        uint256 amount = fees.amount;
        if(amount > 0){
            require(ownedTokens[_caller] >= amount);
            ownedTokens[_caller] = ownedTokens[_caller].sub(amount);
            //The person who submitted the transaction earns the transaction fee
            fees.token.transfer(msg.sender,amount);
        }

        if (ens.owner(domainNode) == address(this)) {
            ens.setSubnodeOwner(domainNode, subdomainLabel, _newOwner);
            emit OwnerChanged(_label,_subdomain,currentOwner,_newOwner);
        }
    }

    function query(bytes32 _label,string _subdomain) public view returns (address){
        bytes32 domainNode = keccak256(abi.encodePacked(TLD_NODE, _label));
        bytes32 subnode = keccak256(abi.encodePacked(domainNode, keccak256(abi.encodePacked(_subdomain))));
        return ens.owner(subnode);
    }

    function setFees(DetailedERC20 _token, uint256 _amount) onlyOwner public{
        require(_token != address(0) && _amount != 0);
        fees = Fee(_token,_amount);
    }

    /*function register(string _subdomain, address _owner) external  {
        uint256 amount = fees.amount;
        if(amount > 0){
            require(ownedTokens[msg.sender] >= amount);
            ownedTokens[msg.sender] = ownedTokens[msg.sender].sub(amount);
        }
        super.register(_subdomain,_owner);
    }*/

    function register(bytes32 _label,string _subdomain, address _owner,bytes _sig) external  {
        bytes32 hash = keccak256(abi.encodePacked(address(this),nonces[_owner],_label,_subdomain,_owner));
        address caller = hash.recover(_sig);
        require(caller == _owner);
        nonces[_owner] = nonces[_owner].add(1); //if we are going to do tx, update nonce

        uint256 amount = fees.amount;
        if(amount > 0){
            require(ownedTokens[caller] >= amount);
            ownedTokens[caller] = ownedTokens[caller].sub(amount);
            //The person who submitted the transaction earns the transaction fee
            fees.token.transfer(msg.sender,amount);
        }
        super.register(_label,_subdomain,_owner);
    }


    function withdraw(uint256 _amount) external{
        require(_amount > 0);
        uint256 ownedAmount = ownedTokens[msg.sender];
        require(ownedAmount >= _amount);
        ownedTokens[msg.sender] = ownedAmount.sub(_amount);
        fees.token.transfer(msg.sender,_amount);
        /*if(fees.token == address(0)){
            msg.sender.transfer(_amount);
        }else{
            fees.token.transfer(msg.sender,_amount);
        }*/
    }

    /*function adminWithdraw(uint256 _amount) onlyOwner external{
        require(_amount > 0);
        fees.token.transfer(msg.sender,_amount);
    }*/

    function() payable public {
        revert();
    }



}
