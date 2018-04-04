pragma solidity ^0.4.19;

import './Commons.sol';
import './AbstractAsset.sol';

contract StandardAsset is AbstractAsset {
  using Commons for Commons.MetaData;

  // asset metadata
  Commons.MetaData private md;

  // multisig support if transactions require multiple confirmations
  //MultiSig private multisig;
  function StandardAsset(address _issuer, uint _id, bytes32 _nsi, bool _transferrable,
    bytes32 _mdRef) AbstractAsset(_id, _issuer, _issuer) public {
    md = Commons.MetaData({
        nsi:_nsi,
        issuer:_issuer,
        transferrable:_transferrable,
        fungible:false,
        dataRef:_mdRef
    });
    AssetCreated(address(this),_id);
  }

  function getMetaData() public view returns (bytes32,address,bool,bool,bytes32) {
    return (md.nsi, md.issuer, md.transferrable, md.fungible, md.dataRef);
  }

  function getNamespace() public view returns (bytes32 nsi) {
    return md.nsi;
  }

  function isTransferrable() public view returns (bool) {
    return md.transferrable;
  }

  function isFungible() public view returns (bool) {
    return md.fungible;
  }

  function getDataRef() public view returns (bytes32) {
    return md.dataRef;
  }

}