pragma solidity ^0.4.19;

import './Asset.sol';
import 'github.com/OpenZeppelin/zeppelin-solidity/contracts/ownership/Ownable.sol';

contract AssetRegistry is Ownable {
  event AssetRegistered(address asset, bytes32 nsi);

  // default namespace id
  bytes32 constant DEFAULT_NSI = "default";

  // number of assets in the registry
  uint256 private numOfAssets;
  // map asset addr to a bool
  mapping(address=>bool) assets;
  // index by namespace
  mapping(bytes32=>address[]) assetsByNamespace;
  // index by owner
  mapping(address=>address[]) assetsByOwner;

  /**
   * @dev create and register a new asset
   * @param _nsi the namespace identifier
   * @param _transferrable is the asset transferrable?
   * @param _fungible is the asset fungible?
   * @param _metadataRef a multihash of the metadata
   */
  function createAsset(bytes32 _nsi, bool _transferrable, bool _fungible, bytes _metadataRef)
    public returns (address) {

    require(_metadataRef.length <= 256);

    if (_nsi == '') {
      _nsi = DEFAULT_NSI;
    }

    Asset _asset = new Asset(msg.sender,_nsi, _transferrable, _fungible, _metadataRef);

    assets[_asset] = true;
    assetsByNamespace[_nsi].push(_asset);
    assetsByOwner[msg.sender].push(_asset);
    numOfAssets++;

    AssetRegistered(address(_asset), _nsi);
    return address(_asset);
  }

  /**
   * @dev register an asset
   * @param _asset the address of the asset to be registered
   */
  function register(address _asset) public returns (bool) {
    require(_asset != address(0));
    require(!assets[_asset]);
    assets[_asset] = true;
    assetsByNamespace[Asset(_asset).getNamespace()].push(_asset);
    assetsByOwner[Asset(_asset).owner()].push(_asset);
    numOfAssets++;
    return true;
  }

  /**
   * @dev return number of assets of current msg.sender
   */
  function getCount() public view returns (uint) {
    return assetsByOwner[msg.sender].length;
  }

}
