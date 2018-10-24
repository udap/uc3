pragma solidity ^0.4.19;

import './FIFSRegistrar.sol';
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import 'openzeppelin-solidity/contracts/token/ERC20/DetailedERC20.sol';
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import './ENS.sol';
import './Resolver.sol';
import 'openzeppelin-solidity/contracts/ECRecovery.sol';

contract HarvestRegistrar is FIFSRegistrar,Ownable{

    using SafeMath for uint256;

    struct Fee {
        DetailedERC20 token;
        uint256 amount;
    }

    Fee public fees = Fee(0,0);

    // Mapping from ERC20Token to amount
    mapping(address => uint256) public ownedTokens;

    // Mapping from caller to nonce
    mapping(address => uint) public nonces;

    event OwnerChanged( string indexed subdomain,address indexed oldOwner, address indexed newOwner);


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

    function transfer(string _subdomain, address _newOwner) public {
        require(_newOwner != address(0));
        bytes32 subdomainLabel = keccak256(_subdomain);
        address currentOwner = ens.owner(keccak256(rootNode,subdomainLabel));

        require(currentOwner == msg.sender);

        if (ens.owner(rootNode) == address(this)) {
            ens.setSubnodeOwner(rootNode, subdomainLabel, _newOwner);
            emit OwnerChanged(_subdomain,currentOwner,_newOwner);
        }
    }

    function query(string _subdomain) public view returns (address){
        bytes32 subnode = keccak256(rootNode, keccak256(_subdomain));
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

    function register(address _txSender,string _subdomain, address _owner,bytes _sig) external  {
        bytes32 hash = keccak256(abi.encodePacked(address(this),nonces[_txSender],_subdomain,_owner));
        address caller = hash.recover(_sig);
        require(caller == _txSender);

        uint256 amount = fees.amount;
        if(amount > 0){
            require(ownedTokens[caller] >= amount);
            ownedTokens[caller] = ownedTokens[caller].sub(amount);
        }
        super.register(_subdomain,_owner);
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

    function adminWithdraw(uint256 _amount) onlyOwner external{
        require(_amount > 0);
        fees.token.transfer(msg.sender,_amount);
    }

    function() payable public { throw; }



}
