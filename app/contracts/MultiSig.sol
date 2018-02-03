pragma solidity 0.4.19;

contract MultiSig {
  uint constant public MAX_OWNER_COUNT = 50;
  // (only) mutable state
  uint public nonce;
  // immutable state
  uint public threshold;
  // immutable state
  mapping (address => bool) ownerRegistered;
  // immutable state
  address[] public owners;

  modifier validThreshold(uint _ownerCount, uint _threshold) {
    require(_ownerCount <= MAX_OWNER_COUNT && _threshold <= _ownerCount && _threshold != 0);
    _;
  }
  function MultiSig(uint _threshold, address[] _owners)
    public validThreshold(_owners.length,_threshold) {

    address lastAdd = address(0);
    for (uint i=0; i<_owners.length; i++) {
      require(_owners[i] > lastAdd);
      ownerRegistered[_owners[i]] = true;
      lastAdd = _owners[i];
    }
    owners = _owners;
    threshold = _threshold;
  }

  function isSigner(address _signer) public view returns (bool) {
      return ownerRegistered[_signer];
  }

  /**
   * @dev check if required signatures are collected
   **/
  function isSigned(bytes32 _msgHash, bytes[] _sigs) public returns (bool) {
    require(_sigs.length == threshold);
    address lastAdd = address(0); // cannot have address(0) as an owner
    for (uint i = 0; i < threshold; i++) {
        var (r,s,v) = getRsv(_sigs[i]);
        address recovered = ecrecover(_msgHash, v, r, s);
        require(recovered > lastAdd && ownerRegistered[recovered]);
        lastAdd = recovered;
    }
  }

  function getRsv(bytes _sig) public returns (bytes32, bytes32, uint8) {
    bytes32 r;
    bytes32 s;
    uint8 v;

    //Check the signature length
    require(_sig.length == 65);

    // Divide the signature in r, s and v variables
    assembly {
      r := mload(add(_sig, 32))
      s := mload(add(_sig, 64))
      v := byte(0, mload(add(_sig, 96)))
    }

    // Version of signature should be 27 or 28, but 0 and 1 are also possible versions
    if (v < 27) {
      v += 27;
    }
    return (r,s,v);
  }

  /**
   * @dev submit transaction to destination address with multiple signatures/approvals.
   * Note that address recovered from signatures must be strictly increasing
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

    address lastAdd = address(0); // cannot have address(0) as an owner
    for (uint i = 0; i < threshold; i++) {
        address recovered = ecrecover(txHash, sigV[i], sigR[i], sigS[i]);
        require(recovered > lastAdd && ownerRegistered[recovered]);
        lastAdd = recovered;
    }

    // If we make it here all signatures are accounted for
    nonce = nonce + 1;
    require(destination.call.value(value)(data));
  }

  function () public payable {}
}
