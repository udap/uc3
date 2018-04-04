pragma solidity 0.4.19;

import './Asset.sol';
import './Pledge.sol';
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract PledgeService is Ownable {
    enum RequestState {
        SUBMITTED, APPROVED, REJECTED
    }

    struct PledgeRequest {
        address requester;
        address collateral;
        uint requestedAmount;
        uint reqId;
        RequestState state;
    }
    // number of requests
    uint private count;
    // all requests
    PledgeRequest[] private reqs;
    // requester to request ids mapping
    mapping(address => uint[]) private reqIds;
    // reqId to pledge mapping
    mapping(uint => address) private pledges;

    modifier assetOwner(address asset) {
        require(asset != address(0) && msg.sender == Asset(asset).getOwner());
        _;
    }

    /**
     * @dev asset owner submits a request for pledging his asset
     * @param _asset address, the asset to be pledged
     * @param _requestedAmount uint the funds to be requested
     */
    function request(address _asset, uint _requestedAmount) public assetOwner(_asset) returns (bytes32) {
        count++;
        PledgeRequest memory req = PledgeRequest({
            requester: msg.sender,
            collateral: _asset,
            requestedAmount: _requestedAmount,
            reqId: count,
            state: RequestState.SUBMITTED
        });
        reqs.push(req);
        reqIds[msg.sender].push(count-1);
        // create msg hash using req.co
        return keccak256(req.collateral);
    }

    /**
     * @dev create create a new pledge given the request id and cosigners
     * @param _reqId uint the request id returned from requestPledge
     * @param _cosigners the approvers who need to sign on the pledge other than the requester and the creditor
     */
    function create(uint _reqId, address[] _cosigners) public onlyOwner returns (address) {
        require(_reqId < count);
        PledgeRequest memory req = reqs[_reqId];
        Pledge pledge = new Pledge(req.requester, msg.sender, req.collateral, _cosigners);
        pledges[_reqId] = address(pledge);
        return address(pledge);
    }
    /**
     * @dev approve a pledge request if other signers have signed the request
     * @param _reqId uint request id
     * @param _approvedAmount credit approved by pledgee
     * @param _dataRef multihash to additional _dataRef
     * @param _signatures signatures collected for this function
     */
    function approve(uint _reqId, uint _approvedAmount, bytes _dataRef, bytes[] _signatures)
        public onlyOwner returns(address) {
        require(_reqId < count);
        PledgeRequest memory req = reqs[_reqId];
        Pledge pledge = Pledge(pledges[_reqId]);
        pledge.approve(_approvedAmount,_dataRef,_signatures);
        return address(pledge);
    }

    /**
     * @dev reject a pledge request
     * @param _reqId uint pledge request id
     * @param _hash bytes multihash value pointing to external storage
     */
    function reject(uint _reqId, bytes _hash) public onlyOwner {
        require(_reqId < count);
        PledgeRequest memory req =  reqs[_reqId];
        req.state = RequestState.REJECTED;
        // if Pledge is created but is rejected by a signer
        if (pledges[_reqId] != address(0)) {
            Pledge pledge = Pledge(pledges[_reqId]);
            pledge.reject(_hash);
        }
    }

    /**
     * @dev execute the pledge by sending funds to pledgor
     * @param _pledge address the address of the pledge to be EXECUTED
     * @param _signatures array of signatures for this function
     */
    function execute(address _pledge, bytes[] _signatures) public onlyOwner {
      require(_pledge != address(0));
      Pledge(_pledge).execute(_signatures);
    }

    /**
     * @dev discharge a pledge
     * @param _pledge address a pledge address
     * @param _hash bytes multihash value pointing to external storage
     */
    function discharge(address _pledge, bytes _hash) public onlyOwner {
        require(_pledge != address(0));
        Pledge(_pledge).discharge(_hash);
    }

}
