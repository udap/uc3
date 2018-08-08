const Web3 = require('web3');
const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
// web3.setProvider(new web3.providers.HttpProvider('https://ropsten.infura.io/HUkrzYiEqgEioBDoT5Mq'));
const contract = require('truffle-contract');

const standardAsset_artifacts = require('..\\build\\contracts\\StandardAsset.json');

let StandardAsset = contract(standardAsset_artifacts);

StandardAsset.setProvider(web3.currentProvider);
// console.log(StandardAsset);



/*StandardAsset.at("0x3d302d72192ea84859cd3d78d1529315a4b08b4f").then(instance => {
    // return instance.getOwnedTokens.call(account,{from: account})
}).then(ids => {
    // console.log("ids=====",ids);
});*/


/*var coinbase = web3.eth.coinbase;
console.log(coinbase);

var balance = web3.eth.getBalance(coinbase);
console.log(balance.toString(10));*/


/*var compiled = web3.eth.compile.solidity(standardAsset);
console.log(compiled);*/

const Tx = require('ethereumjs-tx');
const ethereumCfg = require('./config/ethereumCfg');
var privateKey = new Buffer(ethereumCfg.privateKey, 'hex');

let abi = standardAsset_artifacts.abi;
let bytecode = standardAsset_artifacts.bytecode;
let MyContract = web3.eth.contract(abi);

const gasPrice = web3.eth.gasPrice;
const gasPriceHex = web3.toHex(gasPrice);
const nonce = web3.eth.getTransactionCount(ethereumCfg.address);
const nonceHex = web3.toHex(nonce);

var contractData = MyContract.new.getData("cangdan1", "cd1","www.baidu.com",{data:bytecode});

let gasEstimate = web3.eth.estimateGas({data: contractData});
const gasLimitHex = web3.toHex(gasEstimate);

const rawTx = {
    nonce: nonceHex,
    gasPrice: gasPriceHex,
    gasLimit: gasLimitHex,
    value: '0x00',
    data: contractData
};

var tx = new Tx(rawTx);
tx.sign(privateKey);

var serializedTx = tx.serialize();

//console.log(serializedTx.toString('hex'));
//f889808609184e72a00082271094000000000000000000000000000000000000000080a47f74657374320000000000000000000000000000000000000000000000000000006000571ca08a8bbf888cfa37bbf0bb965423625641fc956967b81d12e23709cead01446075a01ce999b56a8a88504be365442ea61239198e23d1fce7d00fcfc5cd3b44b7215f

web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), (err, hash) => {
    if (!err){
        console.log(hash);
        var receipt = web3.eth.getTransactionReceipt(hash);
        console.log(receipt);
    }
});




