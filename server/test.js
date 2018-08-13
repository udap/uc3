const Web3 = require('web3');
const web3 = new Web3();

const ethereumCfg = require('./config/ethereumCfg');
web3.setProvider(new web3.providers.HttpProvider(ethereumCfg.provider));
const contract = require('truffle-contract');

const standardAsset_artifacts = require('..\\build\\contracts\\StandardAsset.json');

let StandardAsset = contract(standardAsset_artifacts);

StandardAsset.setProvider(web3.currentProvider);

//js sign
function signString(text) {
    /*
    * Sign a string and return (hash, v, r, s) used by ecrecover to regenerate the coinbase address;
    */
    let sha = web3.sha3(text);
    let sig = web3.eth.sign(ethereumCfg.address,sha);
    sig = sig.substr(2, sig.length);
    let r = '0x' + sig.substr(0, 64);
    let s = '0x' + sig.substr(64,128);
    let v = web3.toDecimal(sig.substr(128, 130)) + 27;
    return {sha, v, r, s};
}
console.log(web3.eth.coinbase);
console.log(signString("this is data"));

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
