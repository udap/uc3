pragma solidity ^0.4.19;

import './Asset.sol';
import './MultiSig.sol';
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';
import 'zeppelin-solidity/contracts/ECRecovery.sol';
/**
 * @dev a pledge is a contract between a debtor and a creditor in which the debtor conveys
 * possessory title of the collateral to a creditor to secure repayment for some debt or
 * obligation. It is like an escrow that when both parties accept the pledge, the pledgor
 * gets funds and the pledgee owns the title. when the debt is fully repaid, the pledge
 * is discharged.
 */
contract Pledge {
    enum State {
        INITIATED, APPROVED, REJECTED, EXECUTED, DISCHARGED
    }
    // the debtor and the owner of the asset
    address public pledgor;
    // the creditor who offers credit to the pledgor
    address public pledgee;
    // the asset to be pledged
    address public collateral;
    // the remaining credit
    uint public owingBalance;
    // pledge state
    State public state;
    // pledge reference data (a multihash referencing a P2P or cloud data storage)
    bytes public pledgeRef;
    // discharge reference data (a multihash value referring to a P2P or cloud data storage)
    bytes public dischargeRef;

    // a multisig object
    MultiSig private multiSig;

    modifier onlyPledgee() {
        require(msg.sender == pledgee);
        _;
    }
    /**
     * @dev constructor.
     * @param _pledgor the owner of the asset
     * @param _pledgee the creditor that accepts the pledge and offers credit to the pledgor
     * @param _asset the asset to be pledged to the creditor
     * @param _cosigners approvers who need to sign on transactions other than pledgor and pledgee
     */
    function Pledge(address _pledgor, address _pledgee, address _asset, address[] _cosigners) public {
        require(_pledgor != address(0) && _pledgee != address(0) && _asset != address(0));
        require(_pledgor == Asset(_asset).getOwner());
        pledgor = _pledgor;
        pledgee = _pledgee;
        collateral = _asset;
        address[] memory _signers = new address[](2+_cosigners.length);
        _signers[0] = _pledgor;
        _signers[1] = _pledgee;
        for (uint i=0; i<_cosigners.length; i++) {
            _signers[i+2]=_cosigners[i];
        }
        multiSig = new MultiSig(_signers.length, _signers);
        state = State.INITIATED;
    }

    /**
     * @dev approve this pledge (funds not transferred)
     * @param _approvedAmount funds to be credited to the pledgor
     * @param _dataRef additional data for the approval
     * @param _sigs collected signatures
     */
    function approve(uint _approvedAmount, bytes _dataRef, bytes[] _sigs) public onlyPledgee {
        require(state == State.INITIATED);
        bytes32 _msgHash = keccak256(collateral,pledgor,pledgee);
        require(multiSig.isSigned(_msgHash, _sigs));
        state = State.APPROVED;
        pledgeRef = _dataRef;
        owingBalance = _approvedAmount;
    }

    /**
     * @dev execute the pledge and transfer funds to the pledgor
     * @param _sigs bytes signatures required by this function
     */
    function execute(bytes[] _sigs) public onlyPledgee {
        require(_sigs.length == 2);
        bool[] memory flags = new bool[](2);
        // ensure the signature is from the pledgee
        bytes32 _msgHash = keccak256(collateral,pledgor,pledgee,owingBalance);
        for (uint i=0 ;i<_sigs.length; i++) {
            var (r,s,v) = multiSig.getRsv(_sigs[i]);
            address recovered = ecrecover(_msgHash, v, r, s);
            if (recovered == pledgee) {
                flags[1] = true;
            } else if (recovered == pledgor) {
                flags[0] = true;
            }
        }
        require(flags[0] && flags[1]);
        // submit transaction to the pledgor/debtor with approvedAmount of tokens/ethers
        require(pledgor.call.value(owingBalance)(pledgeRef));
        // update states
        state = State.EXECUTED;
    }

    /**
     * @dev reject
     */
    function reject(bytes _hash) public onlyPledgee {
        require(state == State.INITIATED);
        state = State.REJECTED;
        pledgeRef = _hash;
    }

    /**
     * @dev dischage the pledge with given data
     * @param _hash bytes a multihash value representing the discharge data on a P2P or cloud storage
     */
    function discharge(bytes _hash) public onlyPledgee {
        require(state == State.APPROVED);
        state = State.DISCHARGED;
        owingBalance = 0;
        dischargeRef = _hash;
    }
}
