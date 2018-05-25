pragma solidity ^0.4.19;

import './StandardAsset.sol';
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract AssetRegistry is Ownable {

    event StandardAssetCreated(StandardAsset indexed asset,uint indexed id);


    // Mapping from contract ID to StandardAsset
    mapping(uint=>StandardAsset) public idAssets;



    constructor() public {

    }

    /**
    * @dev  Registering a type of asset
    * @param _name AssetType name
    * @param _symbol AssetType symbol
    */
    function registerAssetClass(string _name,string _symbol) onlyOwner public returns(uint){
        return register(_name,_symbol,"");
    }

    /**
    * @dev  Registering a type of asset
    * @param _name AssetType name
    * @param _symbol AssetType symbol
    * @param _uri AssetType metadata uri
    */
    function registerAssetClass(string _name,string _symbol,string _uri) onlyOwner public returns(uint){
        return register(_name,_symbol,_uri);
    }

    /**
    * @dev internal function, Registering a type of asset
    * @param _name AssetType name
    * @param _symbol AssetType symbol
    * @param _uri AssetType metadata uri
    */
    function register(string _name,string _symbol,string _uri) internal returns(uint){
        uint id = getId(_name, _symbol,_uri);
        if(idAssets[id] != address(0x0)){
            return id;
        }
        StandardAsset asset = new StandardAsset(_name, _symbol,_uri);
        idAssets[id] = asset;
        emit StandardAssetCreated(asset,id);
        return id;
    }

    /**
    * @dev Query asset by id
    * @param _id 'AssetType''s id
    */
    function getAssetClass(uint _id) public view returns(StandardAsset){
        return idAssets[_id];
    }

    /**
    * @dev id generator
    */
    function getId(string _name,string _symbol,string _uri) internal pure returns(uint){
        uint id = uint(keccak256(abi.encodePacked(_name, _symbol,_uri)));
        return id;
    }


}
