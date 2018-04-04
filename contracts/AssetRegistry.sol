pragma solidity ^0.4.19;

import './Asset.sol';
import './StandardAsset.sol';
import './FungibleAsset.sol';

import 'zeppelin-solidity/contracts/ReentrancyGuard.sol';

contract AssetRegistry is ReentrancyGuard {
  event AssetRegistered(address indexed asset, uint indexed assetId);

  // default namespace id
  bytes32 constant DEFAULT_NSI = "default";
  address private owner;
  // number of assets in the registry
  uint256 private numOfAssets;
  // map asset addr to a bool
  mapping(address=>bool) private registeredAssets;
  // index by namespace
  mapping(bytes32=>address[]) private assetsByNamespace;
  // indexed by id
  mapping(uint=>address) private assetsById;

  modifier assetNotRegistered(address _asset) {
      require(!registeredAssets[_asset]);
      _;
  }

  modifier onlyOwner() {
      require(msg.sender == owner);
      _;
  }

  function AssetRegistry(address _owner) public {
    owner = _owner;
  }
  /**
   * @dev create and register a new asset
   * @param _nsi the namespace identifier
   * @param _transferrable is the asset transferrable?
   * @param _fungible is the asset fungible?
   * @param _metadataRef a multihash of the metadata
   */
  function createAsset(bytes32 _nsi, bool _transferrable, bool _fungible, bytes32 _metadataRef)
    public returns (address) {

    if (_nsi == '') {
      _nsi = DEFAULT_NSI;
    }
    // generate a unique asset id
    uint id = uint(keccak256(owner, _nsi, _metadataRef));
    Asset newAsset;
    if (_fungible) {
      newAsset = new StandardAsset(owner, id, _nsi, _transferrable, _metadataRef);
    } else {
      newAsset = new FungibleAsset(owner, id, _nsi, _transferrable, _metadataRef,0);
    }
    registeredAssets[newAsset] = true;
    assetsByNamespace[_nsi].push(address(newAsset));
    assetsById[id] = address(newAsset);
    return address(newAsset);
  }

  /**
   * @dev register an asset
   * @param _asset the address of the asset to be registered
   */
  function register(address _asset) public nonReentrant assetNotRegistered(_asset) {
    registeredAssets[_asset] = true;
    assetsById[Asset(_asset).getId()] = _asset;
    assetsByNamespace[Asset(_asset).getNamespace()].push(_asset);
    numOfAssets++;
    AssetRegistered(_asset,Asset(_asset).getId());
  }

  /**
   * @dev return number of assets
   */
  function getCount() public view onlyOwner returns (uint) {
    return numOfAssets;
  }

  function getAsset(uint assetId) public view returns (address) {
      return assetsById[assetId];
  }

}
