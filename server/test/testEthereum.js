const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/HUkrzYiEqgEioBDoT5Mq"));

const standardAsset_artifacts = require('../../build/contracts/StandardAsset.json');
let abi = standardAsset_artifacts.abi;
let standardAsset = web3.eth.contract(abi).at("0x68f2CBdA42eDb8f2A4Da853b34E772A5f8e98Ce0");
let data = standardAsset.balanceOf.getData("0x110189c51e9b9eebee1ae111c8f28718cf795fef");

console.log("data=====",data);



const contract = require('truffle-contract');
const StandardAsset = contract(standardAsset_artifacts);
StandardAsset.setProvider(web3.currentProvider);

//StandardAsset.at("xxxxxx") Spent a lot of time
StandardAsset.at("0x68f2CBdA42eDb8f2A4Da853b34E772A5f8e98Ce0").then(instance=>{
    console.log("获取完成了instance=======================");
    console.log(instance);
})