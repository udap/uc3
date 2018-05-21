pragma solidity ^0.4.19;

import './StandardAsset.sol';


contract AssetRegistry{

  event AssetTypeRegistered(address indexed asset);

  event AssetTypeCreated(address indexed asset);

  struct AssetType{
    string name;
    string symbol;
    address owner;
    address assetAddr;
  }

  // Array with all token Types
  AssetType[] internal allTypes;


  // Mapping from id  to bool. Indicates that the id is registered
  mapping(uint=>bool) private idRegistered;

  // Mapping from name to  symbol  to  asset Address
  mapping(uint=> AssetType) private idTypes;


  constructor() public{

  }

  function createType(string _name,string _symbol) public returns(address){
    uint id = uint(keccak256(_name, _symbol));
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
    allTypes.push(astype);
    emit AssetTypeCreated(newAsset);
    return address(newAsset);
  }

  function register(address _asset) public{
    StandardAsset stdAsset = StandardAsset(_asset);
    string memory name = stdAsset.name();
    string memory symbol = stdAsset.symbol();
    uint id = uint(keccak256(name, symbol));
    require(idRegistered[id] != true);

    idRegistered[id] = true;
    AssetType memory asType = AssetType({
      name:name,
      symbol:symbol,
      owner:msg.sender,
      assetAddr:address(stdAsset)
      });
    idTypes[id] = asType;
    allTypes.push(asType);
    emit AssetTypeRegistered(_asset);
  }

  function getIdTypes(string _name,string _symbol) public returns(uint,bool,address){
    uint id = uint(keccak256(_name, _symbol));
    return (id,idRegistered[id],idTypes[id].assetAddr);
  }

}
