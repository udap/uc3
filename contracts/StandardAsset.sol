pragma solidity ^0.4.19;

import 'openzeppelin-solidity/contracts/token/ERC721/ERC721Token.sol';
import 'openzeppelin-solidity/contracts/ECRecovery.sol';
import './Controlled.sol';

contract AssetType {

    // Asset type name
    string public name;

    // Asset type symbol
    string public symbol;

    //SupplyLimit
    uint256 public supplyLimit;

    // Asset type metadata uri,Pointing to a json file
    string public uri;

    constructor(string _name, string _symbol, uint256 _supplyLimit, string _uri) public {
        name = _name;
        symbol = _symbol;
        uri = _uri;
        supplyLimit = (_supplyLimit == 0 ? 2 ** 256 - 1 : _supplyLimit);
    }
}

contract StandardAsset is ERC721Token,Controlled {

    using ECRecovery for bytes32;

    uint256 internal id_;


    AssetType private assetType;

    modifier onlyOwnerOrController() {
        require(msg.sender == controller || msg.sender == owner);
        _;
    }

    /**
     * @dev Constructor function
     */
    constructor(string _name, string _symbol, uint256 _supplyLimit, string _classURI, address _owner) public ERC721Token(_name, _symbol) {
        assetType = new AssetType(_name, _symbol, _supplyLimit, _classURI);
        owner = _owner;

    }

    /**
      * @dev create a new token
      * @dev Reverts if the given token ID already exists
      * @param _to address the beneficiary that will own the minted token
      * @param _tokenURI token uri
      */
    function mint(address _to, string _tokenURI) onlyOwnerOrController public {
        _mint(_to, _tokenURI);
    }
    /**
      * @dev Internal function to mint a new token
      * Reverts if the given token ID already exists
      * @param _to address the beneficiary that will own the minted token
      */
    function _mint(address _to, string _tokenURI) internal {
        uint256 tokenId = id_.add(1);
        require(!exists(tokenId) && tokenId <= assetType.supplyLimit());
        id_ = tokenId;
        super._mint(_to, tokenId);
        super._setTokenURI(tokenId, _tokenURI);
    }

    /**
     * @dev create a new token
     * @dev Reverts if the given token ID already exists
     * @param _to address the beneficiary that will own the minted token
     * @param _tokenURI token uri
     *//*
    function mint(address _to, string _tokenURI,bytes _sig) public {
        bytes32 hash = keccak256(abi.encodePacked(_to, _tokenURI));
        address addr = hash.recover(_sig);
        require(addr == owner);
        _mint(_to, _tokenURI);
    }*/

    /**
     * @dev  burn a specific token by its owner
     * @dev Reverts if the token does not exist
     * @param _tokenId uint256 ID of the token being burned by the msg.sender
     */
    function burn(uint256 _tokenId) public {
        super._burn(msg.sender, _tokenId);
    }


    function getAssetType() public view returns (AssetType){
        return assetType;
    }


}
