pragma solidity ^0.4.19;

import './StandardAsset.sol';


contract Escrow {

    enum State { CREATED, ACCEPTED, REJECTED }

    address public recipient;
    address public sender;
    StandardAsset public standardAsset;
    uint256 public assetId;
    State   public state;

    constructor(address _recipient,StandardAsset _standardAsset,uint256 _assetId) public {

        require(_standardAsset.ownerOf(_assetId) == msg.sender );
//        require(msg.sender)
//        recipient = _recipient;
        sender = msg.sender;
        standardAsset = _standardAsset;
        assetId = _assetId;
        state = State.CREATED;
    }

    /*function accept() public {
        if (msg.sender == buyer){
            buyerOk = true;
        } else if (msg.sender == seller){
            sellerOk = true;
        }
        if (buyerOk && sellerOk){
            payBalance();
        } else if (buyerOk && !sellerOk && now > start + 30 days) {
            // Freeze 30 days before release to buyer. The customer has to remember to call this method after freeze period.
            selfdestruct(buyer);
        }
    }

    function payBalance() private {
        // we are sending ourselves (contract creator) a fee
        escrow.transfer(this.balance / 100);
        // send seller the balance
        if (seller.send(this.balance)) {
            balance = 0;
        } else {
            throw;
        }
    }

    function deposit() public payable {
        if (msg.sender == buyer) {
            balance += msg.value;
        }
    }

    function cancel() public {
        if (msg.sender == buyer){
            buyerOk = false;
        } else if (msg.sender == seller){
            sellerOk = false;
        }
        // if both buyer and seller would like to cancel, money is returned to buyer
        if (!buyerOk && !sellerOk){
            selfdestruct(buyer);
        }
    }

    function kill() public constant {
        if (msg.sender == escrow) {
            selfdestruct(buyer);
        }
    }*/
}