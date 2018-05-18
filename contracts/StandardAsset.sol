pragma solidity ^0.4.19;

import 'openzeppelin-solidity/contracts/token/ERC721/ERC721Token.sol';

contract StandardAsset is ERC721Token {

     uint256 internal tokenId_;

    /**
   * @dev Constructor function
   */
    constructor(string _name, string _symbol) public ERC721Token(_name,_symbol) {

    }

    /**
       * @dev create a new token
       * @dev Reverts if the given token ID already exists
       * @param _to address the beneficiary that will own the minted token
       * @param _tokenId uint256 ID of the token to be minted by the msg.sender
       */
    function createAsset(address _to,string _uri) public {
        tokenId_ ++ ;
        super._mint(_to, tokenId_);
        super._setTokenURI(tokenId_,_uri);
    }

    /**
   * @dev  burn a specific token
   * @dev Reverts if the token does not exist
   * @param _owner owner of the token to burn
   * @param _tokenId uint256 ID of the token being burned by the msg.sender
   */
    function destory(address _owner, uint256 _tokenId) canTransfer(_tokenId) public {
        super._burn(_owner, _tokenId);
    }

}
