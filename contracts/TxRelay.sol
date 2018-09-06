pragma solidity ^0.4.19;


import 'openzeppelin-solidity/contracts/ECRecovery.sol';
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

contract TxRelay is Ownable {

    using ECRecovery for bytes32;

    using SafeMath for uint256;

    mapping(address => uint) public nonces;


    /*
    * @dev Relays meta transactions
    */
    function relayMetaTx(address _txSender,address _dest,bytes _data,uint256 _fees,bytes _sig,uint256 _txFees) public {
        require(address(this) != _dest);
        require(_fees >= _txFees);
        bytes32 hash = keccak256(abi.encodePacked(address(this),_txSender,_dest,_data,nonces[_txSender],_fees));
        address addr = hash.recover(_sig);
        require(addr == _txSender);
        nonces[_txSender]++; //if we are going to do tx, update nonce
        require(_dest.call.value(_fees.sub(_txFees))(_data));
    }





}
