pragma solidity ^0.4.19;

import './Commons.sol';
import './AbstractAsset.sol';

contract FungibleAsset is AbstractAsset {
  using Commons for Commons.MetaData;

  // asset metadata
  Commons.MetaData private md;
  uint private amount;

  function FungibleAsset(address _issuer, uint _id, bytes32 _nsi, bool _transferrable,string data,bytes32 _mdHash, uint _amount)
    public AbstractAsset(_id, _issuer, _issuer) {
      md = Commons.MetaData({
          nsi:_nsi,
          issuer:_issuer,
          transferrable:_transferrable,
          fungible:true,
          data:data,
          dataRef:_mdHash
      });
      amount = _amount;
  }

  function getMetaData() public view returns (bytes32,address,bool,bool,string,bytes32) {
    return (md.nsi, md.issuer, md.transferrable, md.fungible,md.data,md.dataRef);
  }

  function getNamespace() public view returns (bytes32) {
    return md.nsi;
  }

  function mdMultiHash() public view returns (bytes32) {
    return md.dataRef;
  }

  function getAmount() public view returns (uint) {
    return amount;
  }
}
