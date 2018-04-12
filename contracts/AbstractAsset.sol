pragma solidity ^0.4.19;

import './Asset.sol';

contract AbstractAsset is Asset {
  // a unique asset id
  uint private id;
  address private issuer;
  address private owner;

  modifier onlyOwner {
    require(msg.sender == owner);
    _;
  }
  modifier onlyIssuer {
    require(msg.sender == issuer);
    _;
  }

  function AbstractAsset(uint _id, address _issuer, address _owner) public {
    require(_issuer != address(0) && _owner != address(0));
    id = _id;
    issuer = _issuer;
    owner = _owner;
    AssetCreated(address(this),id);
  }

  function getId() public view returns (uint) {
    return id;
  }

  function getOwner() public view returns(address) {
    return owner;
  }

  function getIssuer() public view returns (address) {
    return issuer;
  }

  function transfer(address _to) public onlyOwner {
    require(_to != address(0));
    owner = _to;
    AssetTransferred(_to, id);
  }

  function destroy() public onlyOwner {

  }

}
