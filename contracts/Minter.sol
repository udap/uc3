pragma solidity ^0.4.19;

import 'zeppelin-solidity/contracts/token/ERC20/BasicToken.sol';
import './Asset.sol';
import './FungibleAsset.sol';

contract AssetToken is FungibleAsset, BasicToken {
    event Minted(address indexed to, uint256 amount);

  function AssetToken(address _issuer,address _owner, bytes32 _mdHash,uint _amount, uint _tokens)
    FungibleAsset(_issuer,_owner, uint(keccak256(_issuer, _mdHash)),'',true,"",_mdHash, _amount)
    public {
     totalSupply_ = _tokens;
     balances[_issuer] = totalSupply_;
  }

  function transfer(address _to) public {
    super.transfer(_to, totalSupply_);
//    AssetTransferred(_to, tokenId);
  }

  function burn() public {

  }

}

contract Minter {
    function mint(address _asset, address _to, uint _tokens) public returns (address) {
        require(_asset != address(0) && tx.origin == Asset(_asset).getOwner());
        AssetToken token = new AssetToken(FungibleAsset(_asset).getIssuer(),FungibleAsset(_asset).getOwner(),FungibleAsset(_asset).mdMultiHash(),FungibleAsset(_asset).getAmount(),_tokens);
        return address(token);
    }
}
