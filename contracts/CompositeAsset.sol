pragma solidity ^0.4.19;

import './Commons.sol';
import './StandardAsset.sol';

contract CompositeAsset is StandardAsset {

  // map assetId to asset address
  mapping(uint=>address) assets;
  // assetId array
  uint[] assetIds;

  function CompositeAsset(address _issuer, uint _id, bytes32 _nsi, bool _transferrable,string data,bytes32 _mdHash, address[] _assets)
    StandardAsset(_issuer, _id, _nsi, _transferrable,data,_mdHash) public {
    for(uint i=0;i<_assets.length; i++) {
      uint id = Asset(_assets[i]).getId();
      if (assets[i] != 0) {
        assets[id] = _assets[i];
        assetIds.push(id);
      }
    }
  }

  function getAmount() public returns (uint) {
    return assetIds.length;
  }

  function getAsset(uint idx) public returns (address) {
    require(idx < assetIds.length);
    return assets[assetIds[idx]];
  }

  function transfer(address _to, uint _assetId) public {
    require(assets[_assetId] != 0);
    Asset asset = Asset(assets[_assetId]);
    // delete from mapping and array
    delete assets[_assetId];
    uint length = assetIds.length;
    for (uint i=0;i<assetIds.length;i++){
      if (assetIds[i] == _assetId) {
        assetIds[i] = assetIds[length-1];
        delete assetIds[length-1];
        break;
      }
    }
    asset.transfer(_to);
  }

}
