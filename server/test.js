const Web3 = require('web3');

let ethereumCfg = {
    provider:"http://localhost:8545",
    address:"0x67f09ED73F2Fe18965d6f35325Ec983Aff2532e6",
    privateKey:"c2e3c1dec1ca3b77f6e8d58aac4919f930d7653ea44f735810b79800ffadc7f4"
};
const web3 = new Web3(new Web3.providers.HttpProvider(ethereumCfg.provider));


var ethUtil = require('ethereumjs-util');


const Tx = require('ethereumjs-tx');
const privateKey = new Buffer(ethereumCfg.privateKey, 'hex');


//js sign,If used v0.20.6, This account needs to be unlocked. see https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethsign
// https://ethereum.stackexchange.com/questions/693/how-can-i-sign-a-piece-of-data-with-the-private-key-of-an-ethereum-address

//If used v1.0
//https://ethereum.stackexchange.com/questions/23701/can-i-web3-eth-sign-with-private-key

function signString(text) {
    let sha = web3.sha3(text);
    let sign = web3.eth.sign(ethereumCfg.address,sha);

    let vrs = ethUtil.fromRpcSig(sign);
    let ret = {v:vrs.v,r:ethUtil.bufferToHex(vrs.r),s:ethUtil.bufferToHex(vrs.s)};
    ret.sha = sha;
    ret.sig = sign;
    return ret;
   /* sig = sig.substr(2, sig.length);
    let r = '0x' + sig.substr(0, 64);
    let s = '0x' + sig.substr(64,128);
    let v = web3.toDecimal(sig.substr(128, 130)) + 27;
    return {sha:sha,sig:sig,v:v,r:r,s:s};*/
}
let data  = "this is data";
console.log(web3.eth.coinbase);
let ethSignRet = signString(data);
console.log("web3.eth.sign的结果：",ethSignRet);




//solidity verify
/*contract TestSign {
    function check(bytes32 hash, uint8 v, bytes32 r, bytes32 s) constant returns(address) {
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        bytes32 prefixedHash = keccak256(prefix, hash);
        return ecrecover(prefixedHash, v, r, s);
    }
}*/

/*solidity sha3 == web3.sha3
function getsha3(string data) public constant returns(bytes32) {
    return sha3(data);
}*/


/*

let sign = function sign(msg,privateKey) {

    let sha = ethUtil.sha3(msg);
    let sig = ethUtil.ecsign(sha, privateKey);

    /!*_chainId = web3.version.network;
    if (this._chainId > 0) {
        sig.v +=this._chainId * 2 + 8;
    }*!/
    let sigBuff = ethUtil.bufferToHex(Buffer.concat([ sig.r, sig.s, ethUtil.toBuffer(sig.v)]));
    console.log("sig====",sigBuff);
    return {sha:ethUtil.bufferToHex(sha),sig:sig,v:sig.v - 27,r:ethUtil.bufferToHex(sig.r),s:ethUtil.bufferToHex(sig.s)};
};


let utilSignRet  = sign(data,privateKey);
console.log("ethereumjs-util sign的结果：",utilSignRet);

let pubKey = ethUtil.ecrecover(
    ethUtil.toBuffer(ethUtil.sha3(data)),
    parseInt(utilSignRet.sig.v),
    ethUtil.toBuffer(utilSignRet.sig.r),
    ethUtil.toBuffer(utilSignRet.sig.s)
);

console.log("ethUtils.ecrecover的结果publickey：",ethUtil.bufferToHex(ethUtil.pubToAddress(pubKey)));

*/

/*

// ethereumjs-util具有hashPersonalMessage添加前缀并对其进行签名的方法。
let  hashPersonalMessage = ethUtil.hashPersonalMessage(new Buffer(data));
let sig = ethUtil.ecsign(hashPersonalMessage, privateKey);
var signatureRPC = ethUtil.toRpcSig(sig.v, sig.r, sig.s);

console.log("signatureRPC",signatureRPC);
console.log("hashPersonalMessage 结果：",{v:sig.v,r:ethUtil.bufferToHex(sig.r),s:ethUtil.bufferToHex(sig.s)}) ;
*/
let web3Util = require('web3-utils');

let sign = function sign(privateKey) {

    // let sha = ethUtil.sha3(["0x67f09ED73F2Fe18965d6f35325Ec983Aff2532e6","www.baidu.com"]);
    let sha = web3Util.soliditySha3({
        type: 'address', value: '0x67f09ED73F2Fe18965d6f35325Ec983Aff2532e6'
    },{type: 'string', value: 'www.baidu.com'});
    sha = sha.substr(2);
    sha = new Buffer(sha, 'hex');
    let sig = ethUtil.ecsign(sha, privateKey);
    //solidity:0x39588101491b0250bd6cecf501960004d289c97d261e57dcd8e1d127653b4c47
    //ethUtil.sha3:0x3a333e1fb2d1b4e7b530eea4ac5f031d4b88d9b506c0b385781b2094fa45f2f5
    //web3Util.soliditySha3: 0x0519b0c23cd675bd0cde121e96b0b7585c49f16887a5d035d693c94acc418bfb

    /*_chainId = web3.version.network;
    if (this._chainId > 0) {
        sig.v +=this._chainId * 2 + 8;
    }*/
    let sigBuff = ethUtil.bufferToHex(Buffer.concat([ sig.r, sig.s, ethUtil.toBuffer(sig.v)]));
    console.log("sig====",sigBuff);
    return {sha:ethUtil.bufferToHex(sha),sig:sig,v:sig.v - 27,r:ethUtil.bufferToHex(sig.r),s:ethUtil.bufferToHex(sig.s)};
};


let utilSignRet  = sign(privateKey);
console.log("ethereumjs-util sign的结果：",utilSignRet);


let pubKey = ethUtil.ecrecover(
    ethUtil.toBuffer("0x39588101491b0250bd6cecf501960004d289c97d261e57dcd8e1d127653b4c47"),
    parseInt(utilSignRet.sig.v),
    ethUtil.toBuffer(utilSignRet.sig.r),
    ethUtil.toBuffer(utilSignRet.sig.s)
);

console.log("ethUtils.ecrecover的结果publickey：",ethUtil.bufferToHex(ethUtil.pubToAddress(pubKey)));