const Web3 = require('web3');

const ethereumCfg = require('./config/ethereumCfg');
const web3 = new Web3(new Web3.providers.HttpProvider(ethereumCfg.provider));


var ethUtil = require('ethereumjs-util');


const Tx = require('ethereumjs-tx');
const privateKey = new Buffer(ethereumCfg.privateKey, 'hex');


//js sign,If used v0.20.6, This account needs to be unlocked. see https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethsign
// https://ethereum.stackexchange.com/questions/693/how-can-i-sign-a-piece-of-data-with-the-private-key-of-an-ethereum-address

//If used v1.0
//https://ethereum.stackexchange.com/questions/23701/can-i-web3-eth-sign-with-private-key

function signString(text) {
    /*
    * Sign a string and return (hash, v, r, s) used by ecrecover to regenerate the coinbase address;
    */
    let sha = web3.sha3(text);
    let sig = web3.eth.sign(ethereumCfg.address,sha);


    console.log(sig);
    sig = sig.substr(2, sig.length);
    let r = '0x' + sig.substr(0, 64);
    let s = '0x' + sig.substr(64,128);
    let v = web3.toDecimal(sig.substr(128, 130)) + 27;
    return {sha, v, r, s};
}
let data  = "this is data";
console.log(web3.eth.coinbase);
console.log("web3.eth.sign的结果：",signString(data));

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

let sign = function sign(msg,privateKey) {
    let sha = ethUtil.sha3(msg);
    let sig = ethUtil.ecsign(sha, privateKey);
    /*if (this._chainId > 0) {
        sig.v += this._chainId * 2 + 8;
    }*/
    let sigBuff = ethUtil.bufferToHex(Buffer.concat([ sig.r, sig.s, ethUtil.toBuffer(sig.v - 27) ]));
    return {sig:sig,sha:ethUtil.bufferToHex(sha),sigBuff:sigBuff,r:ethUtil.bufferToHex(sig.r),s:ethUtil.bufferToHex(sig.s),v:sig.v - 27};
};
let prefix = "\x19Ethereum Signed Message:\n";

let utilSignRet  = sign(data,privateKey);
console.log("ethereumjs-util sign的结果：",utilSignRet);


// let pubkey = ethUtil.ecrecover(ethUtil.sha3(data), utilSignRet.v+ 27, utilSignRet.r, utilSignRet.s);

let pubKey = ethUtil.ecrecover(
    ethUtil.toBuffer(ethUtil.sha3(data)),
    parseInt(utilSignRet.sig.v),
    ethUtil.toBuffer(utilSignRet.sig.r),
    ethUtil.toBuffer(utilSignRet.sig.s)
);

let fromSigned = ethUtil.fromSigned(utilSignRet.sig);

console.log("ethUtils.ecrecover的结果pubkey：",ethUtil.bufferToHex(pubKey));
