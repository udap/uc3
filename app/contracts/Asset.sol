pragma solidity ^0.4.19;

import 'github.com/OpenZeppelin/zeppelin-solidity/contracts/ownership/Ownable.sol';

contract Asset is Ownable {

  event AssetCreated(address asset, bytes32 nsi, address issuer);

  struct MetaData {
      bytes32 nsi;
      address issuer;
      bool transferrable;
      bool fungible;
      bytes dataRef;
  }

  MetaData md;

  modifier onlyIssuer {
    require(msg.sender == md.issuer);
    _;
  }

  /**
   * @dev constructor
   * @param _nsi namespace identifier
   * @param _mdRef metadata multihash
   */
  function Asset(address _issuer, bytes32 _nsi, bool _transferrable, bool _fungible,
    bytes _mdRef) Ownable() public {
    require(_issuer != address(0));
    md = MetaData({
        nsi:_nsi,
        issuer:_issuer,
        transferrable:_transferrable,
        fungible:_fungible,
        dataRef:_mdRef
    });
    owner = _issuer;
    AssetCreated(address(this),md.nsi,md.issuer);
  }

  function getNamespace() public view returns (bytes32 nsi) {
    return md.nsi;
  }

  function getIssuer() public view returns (address) {
    return md.issuer;
  }

  function isTransferrable() public view returns (bool) {
    return md.transferrable;
  }

  function setTransferrable(bool _transferrable) public onlyIssuer onlyOwner {
    md.transferrable = _transferrable;
  }

  function isFungible() public view returns (bool) {
    return md.fungible;
  }

  function setFungible(bool _fungible) public onlyIssuer onlyOwner {
    md.fungible = _fungible;
  }

  function setIssuer(address newIssuer) public onlyIssuer onlyOwner {
    require(newIssuer!=address(0));
    md.issuer = newIssuer;
  }

  function getDataRef() public view returns (bytes) {
    return md.dataRef;
  }
}
