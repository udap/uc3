pragma solidity ^0.4.19;


import 'openzeppelin-solidity/contracts/ECRecovery.sol';
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

contract TxRelay is Ownable {

    using ECRecovery for bytes32;

    using SafeMath for uint256;

    mapping(address => uint) nonce;

    mapping(address => uint256) balance;


    /*
    * @dev Relays meta transactions
    */
    function relayMetaTx(address _txSender,address _dest,bytes _data,uint256 _fees,bytes _sig) public {
        require(balance[_txSender] >= _fees);
        bytes32 hash = keccak256(abi.encodePacked(this,_txSender,_dest,_data,nonce[_txSender],_fees));
        address addr = hash.recover(_sig);
        require(addr == _txSender);
        nonce[_txSender]++; //if we are going to do tx, update nonce
        balance = balance.sub(_fees);
        require(_dest.call(data));
    }


    /*
     * @dev Returns the local nonce of an account.
     * @param add The address to return the nonce for.
     * @return The specific-to-this-contract nonce of the address provided
     */
    function getNonce(address addr) public constant returns (uint) {
        return nonce[addr];
    }

    function withdrawal() public{
        msg.sender.transfer(balance[msg.sender]);
    }

    function ownerWithdrawal() public onlyOwner{
        msg.sender.transfer(this.balance);
    }

    function() payable public {
        balance = balance.add(msg.value);
    }
}
