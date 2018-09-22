const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/HUkrzYiEqgEioBDoT5Mq"));

const standardAsset_artifacts = require('../../build/contracts/StandardAsset.json');
let abi = standardAsset_artifacts.abi;

let startGetData = new Date().getTime();
let contract = web3.eth.contract(abi);
// let standardAsset = web3.eth.contract(abi).at("0x68f2CBdA42eDb8f2A4Da853b34E772A5f8e98Ce0");
// let data = standardAsset.balanceOf.getData("0x110189c51e9b9eebee1ae111c8f28718cf795fef");

contract.at("0x68f2CBdA42eDb8f2A4Da853b34E772A5f8e98Ce0");

let contract2 = contract.at("0xb398CEbdC41d2935a438659dA3F0B01Fb583F339");


let endGetData = new Date().getTime();

console.log("data spend time =====",endGetData - startGetData);



const contractTruffle = require('truffle-contract');
const StandardAsset = contractTruffle(standardAsset_artifacts);
StandardAsset.setProvider(web3.currentProvider);

let startInstance = new Date().getTime();
//StandardAsset.at("xxxxxx") Spent a lot of time
let endInstance = startInstance;
StandardAsset.at("0x68f2CBdA42eDb8f2A4Da853b34E772A5f8e98Ce0").then(instance=>{
    endInstance = new Date().getTime();
    console.log("instance spend time =======",endInstance - startInstance);
    let owner = "0x110189c51e9b9eebee1ae111c8f28718cf795fef";
    return instance.balanceOf.call(owner,{from: owner});
}).then(balance=>{
    console.log("get balance spend time ===",new Date().getTime() - endInstance);
})