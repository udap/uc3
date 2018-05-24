pragma solidity ^0.4.19;

import './StandardAsset.sol';


contract AssetRegistry{

  event AssetTypeRegistered(address indexed creator,address indexed asset);

  event AssetTypeCreated(address indexed creator,address indexed asset);

  struct AssetType{
    string name;
    string symbol;
    address owner;
    address assetAddr;
  }

  // Mapping from id  to bool. Indicates that the id is registered
  mapping(uint=>bool) public idRegistered;

  // Mapping from name to  symbol  to  asset Address
  mapping(uint=> AssetType) private idTypes;


  constructor() public{

  }

  /**
  * @dev create AssetType
  * @param _name token name
  * @param _symbol token symbol
  */
  function createType(string _name,string _symbol) public returns(address){
    uint id = getId(_name, _symbol);
    require(idRegistered[id] != true);

    StandardAsset newAsset = new StandardAsset(_name,_symbol);
    idRegistered[id] = true;
    AssetType memory astype = AssetType({
        name:_name,
        symbol:_symbol,
        owner:msg.sender,
        assetAddr:address(newAsset)
      });
    idTypes[id] = astype;
    emit AssetTypeCreated(msg.sender,newAsset);
    return address(newAsset);
  }

  /**
  * @dev register AssetType
  * @param _asset 'StandardAsset''s   address
  */
  function registerType(address _asset) public{
    StandardAsset stdAsset = StandardAsset(_asset);
    string memory name = stdAsset.name();
    string memory symbol = stdAsset.symbol();
    uint id = getId(name, symbol);
    require(idRegistered[id] != true);

    idRegistered[id] = true;
    AssetType memory asType = AssetType({
      name:name,
      symbol:symbol,
      owner:msg.sender,
      assetAddr:address(stdAsset)
      });
    idTypes[id] = asType;
    emit AssetTypeRegistered(msg.sender,_asset);
  }

  /**
  * @dev global id of AssetType
  * @param _name AssetType name
  * @param _symbol AssetType symbol
  */
  function getId(string _name,string _symbol) internal pure returns(uint){
    uint id = uint(keccak256(abi.encodePacked(_name, _symbol)));
    return id;
  }

  /**
  * @param _name AssetType name
  * @param _symbol AssetType symbol
  */
  function getAssetType(string _name,string _symbol) public view returns(address,address){
    uint id = getId(_name,_symbol);
    return (idTypes[id].owner,idTypes[id].assetAddr);
  }



}
