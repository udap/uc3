pragma solidity ^0.4.19;

import './StandardAsset.sol';
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract AssetRegistry is Ownable {

    event AssetRegistered(StandardAsset indexed asset, uint indexed id);

    // Mapping from contract ID to StandardAsset
    mapping(uint => StandardAsset) public idAssets;

    constructor() public {

    }

    /**
    * @dev  Registering a type of asset that has at most one asset
    * @param _name AssetType name
    * @param _symbol AssetType symbol
    */
    function registerClass(string _name, string _symbol, address _owner) onlyOwner public returns (uint){
        return register(_name, _symbol, 1, "", _owner);
    }

    /**
    * @dev  Registering a type of asset
    * @param _name AssetType name
    * @param _symbol AssetType symbol
    * @param _supplyLimit supply limit
    * @param _uri AssetType metadata uri
    */
    function registerClass(string _name, string _symbol, uint256 _supplyLimit, string _uri, address _owner) onlyOwner public returns (uint){
        return register(_name, _symbol, _supplyLimit, _uri, _owner);
    }

    /* function registerClass(AssetType _type) onlyOwner public returns (uint) {
         uint id = getId(_type.name(), _type.symbol(), _type.uri());
         require(idAssets[id] == address(0x0));
         idAssets[id] = id;
         emit AssetRegistered(_type, id);
         return id;
     }   */

    /**
    * @dev internal function, Registering a type of asset
    * @param _name AssetType name
    * @param _symbol AssetType symbol
    * @param _uri AssetType metadata uri
    */
    function register(string _name, string _symbol, uint256 _supplyLimit, string _uri, address _owner) internal returns (uint){
        uint id = getId(_name, _symbol, _uri);
        require(idAssets[id] == address(0x0));
        StandardAsset asset = new StandardAsset(_name, _symbol, _supplyLimit, _uri, _owner);
        idAssets[id] = asset;
        emit AssetRegistered(asset, id);
        return id;
    }

    /**
    * @dev id generator
    */
    function getId(string _name, string _symbol, string _uri) public pure returns (uint){
        uint256 id = uint256(keccak256(abi.encodePacked(_name, _symbol, _uri)));
        return id;
    }

}
