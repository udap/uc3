pragma solidity ^0.4.19;

contract TokenSendAgent {

    //token addresses-->tokenId-->from
    mapping (address => mapping (uint256 => address)) public tokenFrom;

    //token addresses-->tokenId-->to
    mapping (address => mapping (uint256 => address)) public tokenTo;


    //token addresses-->from---->tokenIds
    mapping (address => mapping (address => uint256[])) public fromTokens;

    //token addresses-->to---->tokenIds
    mapping (address => mapping (address => uint256[])) public toTokens;










}