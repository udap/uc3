pragma solidity ^0.4.19;

import 'openzeppelin-solidity/contracts/token/ERC721/ERC721Token.sol';

contract StandardAsset is ERC721Token {

    enum State {
        ISSUED, APPROVED, REJECTED
    }

     uint256 internal tokenId_;

    // Mapping from token ID to issuer
    mapping (uint256 => address) internal tokenIssuer;

    // Mapping from token ID to State
    mapping (uint256 => State) internal tokenState;

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
        uint256 tokenId = tokenId_ ++ ;
        require(!exists(tokenId));
        super._mint(_to, tokenId);
        super._setTokenURI(tokenId,_uri);
        tokenIssuer[tokenId] = msg.sender;
        tokenState[tokenId] = State.ISSUED;
    }

    /**
   * @dev  burn a specific token
   * @dev Reverts if the token does not exist
   * @param _owner owner of the token to burn
   * @param _tokenId uint256 ID of the token being burned by the msg.sender
   */
    function destory(address _owner, uint256 _tokenId) public {
//        require(tokenState[_tokenId] != State.APPROVED);
        super._burn(_owner, _tokenId);
        delete tokenIssuer[_tokenId];
        delete tokenState[_tokenId];
    }

    /**
  * @dev set the token State for a given token
  * @dev Reverts if the token ID does not exist
  * @param _tokenId uint256 ID of the token to set its State
  * @param _state new  State
  */
    function setTokenState(uint256 _tokenId, State _state) public onlyOwnerOf(_tokenId) {
        require(tokenState[_tokenId] == State.ISSUED);
        require(exists(_tokenId));
        tokenState[_tokenId] = _state;
    }

}
