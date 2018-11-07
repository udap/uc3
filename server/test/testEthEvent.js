const ethereumCfg = require('../config/ethereumCfg');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/HUkrzYiEqgEioBDoT5Mq"));

/*const SolidityCoder = require("web3/lib/solidity/coder.js");
web3.eth.getTransactionReceipt("0x12e3384bdba97c631bbaa5df27e94e6baeb9ee894ee80c7d9ce0e1b9944b70d7",function(error, result){
    if(!error){
        // console.log("receipt ==== ",result);
        let logs = result.logs;
        console.log("logs ==== ",logs);
        let data = SolidityCoder.decodeParams(["address", "uint256"], logs[2].data.replace("0x", ""));
        console.log("data ==== ",data);
    }
    else
        console.error(error);
});*/

let abi="[\n" +
    "\t{\n" +
    "\t\t\"constant\": false,\n" +
    "\t\t\"inputs\": [],\n" +
    "\t\t\"name\": \"check\",\n" +
    "\t\t\"outputs\": [\n" +
    "\t\t\t{\n" +
    "\t\t\t\t\"name\": \"\",\n" +
    "\t\t\t\t\"type\": \"uint256\"\n" +
    "\t\t\t}\n" +
    "\t\t],\n" +
    "\t\t\"payable\": false,\n" +
    "\t\t\"stateMutability\": \"nonpayable\",\n" +
    "\t\t\"type\": \"function\"\n" +
    "\t},\n" +
    "\t{\n" +
    "\t\t\"anonymous\": false,\n" +
    "\t\t\"inputs\": [\n" +
    "\t\t\t{\n" +
    "\t\t\t\t\"indexed\": true,\n" +
    "\t\t\t\t\"name\": \"_sig\",\n" +
    "\t\t\t\t\"type\": \"address\"\n" +
    "\t\t\t},\n" +
    "\t\t\t{\n" +
    "\t\t\t\t\"indexed\": true,\n" +
    "\t\t\t\t\"name\": \"id\",\n" +
    "\t\t\t\t\"type\": \"uint256\"\n" +
    "\t\t\t}\n" +
    "\t\t],\n" +
    "\t\t\"name\": \"CreateAssertAll\",\n" +
    "\t\t\"type\": \"event\"\n" +
    "\t},\n" +
    "\t{\n" +
    "\t\t\"anonymous\": false,\n" +
    "\t\t\"inputs\": [\n" +
    "\t\t\t{\n" +
    "\t\t\t\t\"indexed\": true,\n" +
    "\t\t\t\t\"name\": \"_sig\",\n" +
    "\t\t\t\t\"type\": \"address\"\n" +
    "\t\t\t},\n" +
    "\t\t\t{\n" +
    "\t\t\t\t\"indexed\": false,\n" +
    "\t\t\t\t\"name\": \"id\",\n" +
    "\t\t\t\t\"type\": \"uint256\"\n" +
    "\t\t\t}\n" +
    "\t\t],\n" +
    "\t\t\"name\": \"CreateAssertOne\",\n" +
    "\t\t\"type\": \"event\"\n" +
    "\t},\n" +
    "\t{\n" +
    "\t\t\"anonymous\": false,\n" +
    "\t\t\"inputs\": [\n" +
    "\t\t\t{\n" +
    "\t\t\t\t\"indexed\": false,\n" +
    "\t\t\t\t\"name\": \"_sig\",\n" +
    "\t\t\t\t\"type\": \"address\"\n" +
    "\t\t\t},\n" +
    "\t\t\t{\n" +
    "\t\t\t\t\"indexed\": false,\n" +
    "\t\t\t\t\"name\": \"id\",\n" +
    "\t\t\t\t\"type\": \"uint256\"\n" +
    "\t\t\t}\n" +
    "\t\t],\n" +
    "\t\t\"name\": \"Create\",\n" +
    "\t\t\"type\": \"event\"\n" +
    "\t}\n" +
    "]";

let SolidityEvent = require("web3/lib/web3/event.js");
let logParser =  (logs, abi) => {

    // pattern similar to lib/web3/contract.js:  addEventsToContract()
    let decoders = abi.filter(function (json) {
        return json.type === 'event';
    }).map(function(json) {
        // note first and third params required only by enocde and execute;
        // so don't call those!
        return new SolidityEvent(null, json, null);
    });

    return logs.map(function (log) {
        return decoders.find(function(decoder) {
            return (decoder.signature() == log.topics[0].replace("0x",""));
        }).decode(log);
    })
};
web3.eth.getTransactionReceipt("0x12e3384bdba97c631bbaa5df27e94e6baeb9ee894ee80c7d9ce0e1b9944b70d7",function(error, result){
    if(!error){
        // console.log("receipt ==== ",result);
        let logs = result.logs;
        let events = logParser(logs,JSON.parse(abi));
        console.log("logParser === ",events)
    }
    else
        console.error(error);
});

/*web3.eth.getTransaction("0x3b6c866c6e74eaceda3f7e6ce5021bf4f12a2ac51cbdecee48358296eb1abd5b",function(error, result){
    if(!error)
        console.log("transaction ==== ",result);
    else
        console.error(error);
});*/

