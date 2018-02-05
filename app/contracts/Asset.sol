pragma solidity ^0.4.19;

contract Asset {
  event AssetCreated(address indexed _asset, uint indexed _id);
  event AssetTransferred(address indexed _to, uint indexed _id);
  event AssetDestroyed(uint indexed _assetId);

  function getMetaData() public view returns (bytes32,address,bool,bool,bytes32);
  function getId() public view returns (uint);
  function getIssuer() public view returns (address);
  function getOwner() public view returns (address);
  function getNamespace() public view returns (bytes32);

  function transfer(address _to) public;
  function destroy() public;
}
