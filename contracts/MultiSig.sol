pragma solidity 0.4.19;

contract MultiSig {
  uint constant public MAX_SIGNER_COUNT = 50;
  uint public nonce;
  uint public threshold;
  mapping (address => bool) private signerRegistered;
  // trx hash to confirmations
  mapping (bytes32 => mapping (address => bool)) private txConfirmations;
  address[] public signers;

  modifier validThreshold(uint _signerCount, uint _threshold) {
    require(_signerCount <= MAX_SIGNER_COUNT && _threshold <= _signerCount && _threshold != 0);
    _;
  }

    modifier onlyOwner() {
        require(msg.sender == address(this));
        _;
    }

    modifier signerDoesNotExist(address _signer) {
        require(!signerRegistered[_signer]);
        _;
    }

    modifier signerExists(address _signer) {
        require(signerRegistered[_signer]);
        _;
    }

    modifier validAddress(address _addr) {
        require(_addr != address(0));
        _;
    }

  /**
   * @dev constructor to create a MultiSig contract.
   * @param _threshold uint the number of required confirmation
   */
  function MultiSig(uint _threshold, address[] _signers)
    public validThreshold(_signers.length,_threshold) {
    for (uint i=0; i<_signers.length; i++) {
        require(!signerRegistered[_signers[i]] && _signers[i] != address(0));
        signerRegistered[_signers[i]] = true;
    }
    signers = _signers;
    threshold = _threshold;
  }

    function addSigner(address _signer)
        public onlyOwner validAddress(_signer) signerDoesNotExist(_signer) {
        signerRegistered[_signer] = true;
        signers.push(_signer);
    }

    function removeSigner(address _signer)
        public onlyOwner validAddress(_signer) signerExists(_signer) {
        signerRegistered[_signer] = false;
        for (uint i=0; i<signers.length - 1; i++) {
            if (signers[i] == _signer) {
                signers[i] = signers[signers.length - 1];
                break;
            }
        }
        signers.length -= 1;
        if (threshold > signers.length)
            changeThreshold(signers.length);
    }

    function changeThreshold(uint _threshold)
        public onlyOwner validThreshold(signers.length,_threshold) {
        threshold = _threshold;
    }

  function isSigner(address _signer) public view returns (bool) {
      return signerRegistered[_signer];
  }


  /**
   * @dev submit transaction to destination address with multiple signatures/approvals.
   * @param sigV bytes32 signature v
   * @param sigR bytes32 signature r
   * @param sigS bytes32 signature s
   * @param destination address the target address that the transaction is sent to
   * @param value uint number of ether/token to be sent to the destination
   * @param data a multihash value for  additonal transaction data
   */
  function execute(uint8[] sigV, bytes32[] sigR, bytes32[] sigS, address destination, uint value, bytes data) public {
    require(sigR.length == threshold);
    require(sigR.length == sigS.length && sigR.length == sigV.length);

    // Follows ERC191 signature scheme: https://github.com/ethereum/EIPs/issues/191
    bytes32 txHash = keccak256(byte(0x19), byte(0), this, destination, value, data, nonce);

    for (uint i = 0; i < threshold; i++) {
        address recovered = ecrecover(txHash, sigV[i], sigR[i], sigS[i]);
        if (signerRegistered[recovered])
            txConfirmations[txHash][recovered] = true;
    }
    uint count = 0;
    for (i=0; i<signers.length; i++) {
        if (txConfirmations[txHash][signers[i]])
            count+=1;
        if (count == threshold) break;
    }
    require(count == threshold);

    // If we make it here all signatures are accounted for
    nonce = nonce + 1;
    require(destination.call.value(value)(data));
  }

  function getRsv(bytes signedString) public returns (bytes32,bytes32,uint8){
      bytes32  r = bytesToBytes32(slice(signedString, 0, 32));
      bytes32  s = bytesToBytes32(slice(signedString, 32, 32));
      byte  v = slice(signedString, 64, 1)[0];
      return (r,s,uint8(v));
  }

    function slice(bytes memory data, uint start, uint len) public returns (bytes){
        bytes memory b = new bytes(len);

        for(uint i = 0; i < len; i++){
            b[i] = data[i + start];
        }

        return b;
    }
    function bytesToBytes32(bytes memory source) public returns (bytes32 result) {
        assembly {
            result := mload(add(source, 32))
        }
    }

  function () public payable {}

}
