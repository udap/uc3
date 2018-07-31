const Web3 = require('web3');
const web3 = new Web3();
// web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
web3.setProvider(new web3.providers.HttpProvider('https://ropsten.infura.io/HUkrzYiEqgEioBDoT5Mq'));



const contract = require('truffle-contract');

const standardAsset_artifacts = require('..\\build\\contracts\\StandardAsset.json');

let StandardAsset = contract(standardAsset_artifacts);


StandardAsset.setProvider(web3.currentProvider);
// console.log(StandardAsset);



StandardAsset.at("0x3d302d72192ea84859cd3d78d1529315a4b08b4f").then(instance => {
    // return instance.getOwnedTokens.call(account,{from: account})
}).then(ids => {
    // console.log("ids=====",ids);
});


/*var coinbase = web3.eth.coinbase;
console.log(coinbase);

var balance = web3.eth.getBalance(coinbase);
console.log(balance.toString(10));*/


/*var compiled = web3.eth.compile.solidity(standardAsset);
console.log(compiled);*/





