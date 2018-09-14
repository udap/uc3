
const  InterfaceId_ERC721 = "0x80ac58cd";
/*
 * 0x80ac58cd ===
 *   bytes4(keccak256('balanceOf(address)')) ^
 *   bytes4(keccak256('ownerOf(uint256)')) ^
 *   bytes4(keccak256('approve(address,uint256)')) ^
 *   bytes4(keccak256('getApproved(uint256)')) ^
 *   bytes4(keccak256('setApprovalForAll(address,bool)')) ^
 *   bytes4(keccak256('isApprovedForAll(address,address)')) ^
 *   bytes4(keccak256('transferFrom(address,address,uint256)')) ^
 *   bytes4(keccak256('safeTransferFrom(address,address,uint256)')) ^
 *   bytes4(keccak256('safeTransferFrom(address,address,uint256,bytes)'))
 */

const InterfaceId_ERC721Exists = "0x4f558e79";
/*
 * 0x4f558e79 ===
 *   bytes4(keccak256('exists(uint256)'))
 */

const InterfaceId_ERC721Enumerable = "0x780e9d63";
/**
 * 0x780e9d63 ===
 *   bytes4(keccak256('totalSupply()')) ^
 *   bytes4(keccak256('tokenOfOwnerByIndex(address,uint256)')) ^
 *   bytes4(keccak256('tokenByIndex(uint256)'))
 */

const InterfaceId_ERC721Metadata = "0x5b5e139f";

const InterfaceId_StandardAsset = "0x1b2b8ef1";

const supportFull721 =async (assetInstance,caller) =>{
    let support721 = await assetInstance.supportsInterface.call(InterfaceId_ERC721,{from: caller}).catch(err => {});
    let support721Enum = await assetInstance.supportsInterface.call(InterfaceId_ERC721Enumerable,{from: caller}).catch(err => {});
    let support721Metadata = await assetInstance.supportsInterface.call(InterfaceId_ERC721Metadata,{from: caller}).catch(err => {});
    if(support721 == true && support721Enum == true  && support721Metadata == true)
        return true;
    else
        return false;
}

module.exports  = {
    InterfaceId_ERC721:InterfaceId_ERC721,
    InterfaceId_ERC721Exists:InterfaceId_ERC721Exists,
    InterfaceId_ERC721Enumerable:InterfaceId_ERC721Enumerable,
    InterfaceId_ERC721Metadata:InterfaceId_ERC721Metadata,
    InterfaceId_StandardAsset:InterfaceId_StandardAsset,
    supportFull721:supportFull721
};