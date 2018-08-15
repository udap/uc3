pragma solidity ^0.4.19;

import 'openzeppelin-solidity/contracts/token/ERC721/ERC721Token.sol';
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

contract AssetType {

    // Asset type name
    string public name;

    // Asset type symbol
    string public symbol;

    // Asset type metadata uri,Pointing to a json file
    string public uri;

    constructor(string _name, string _symbol,string _uri) public {
        name = _name;
        symbol = _symbol;
        uri = _uri;
    }
}

contract StandardAsset is ERC721Token,Ownable {

     uint256 internal id_;

    //token  issuer
    address public issuer;

    AssetType private assetType;

    /**
   * @dev Constructor function
   */
    constructor(string _name, string _symbol,string _classURI) public ERC721Token(_name,_symbol) {
        assetType = new AssetType(_name,_symbol,_classURI);
        issuer = owner;

    }

    /**
       * @dev create a new token
       * @dev Reverts if the given token ID already exists
       * @param _to address the beneficiary that will own the minted token
       * @param _tokenURI token uri
       */
    function mint(address _to,string _tokenURI) onlyOwner public  {
        uint256 tokenId = id_ ++ ;
        require(!exists(tokenId));
        super._mint(_to, tokenId);
        super._setTokenURI(tokenId,_tokenURI);
    }

    /**
   * @dev  burn a specific token
   * @dev Reverts if the token does not exist
   * @param _owner owner of the token to burn
   * @param _tokenId uint256 ID of the token being burned by the msg.sender
   */
    function burn(address _owner, uint256 _tokenId) public {
        super._burn(_owner, _tokenId);
    }


    /**
   * @dev Returns token IDs of owner
   * @param _owner token owner
   */
    function getOwnedTokens(address _owner)public view returns(uint256[]){
        return ownedTokens[_owner];
    }

    function getAssetType() public view returns(AssetType){
        return assetType;
    }







}
