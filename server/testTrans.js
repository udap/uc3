const Web3 = require('web3');
const Tx = require('ethereumjs-tx');

let ethereumCfg = {
    provider:"http://47.104.225.39:8545",
    address:"0xec7866550cf25820d346b19dfd74ee2e0daf35de",
    privateKey:"54cb0ff772b0bd47fbd5fa6bed57ea919930c21940494f7af7a9fff2a3df0783"
};
const web3 = new Web3(new Web3.providers.HttpProvider(ethereumCfg.provider));

let receipt = web3.eth.getTransactionReceipt("0xa349f882e3f1cdf9cc48501f825f3b429f8cf2e4620f1efcae3b2cdffc960b09");
console.log(receipt);

/*

const privateKey = new Buffer(ethereumCfg.privateKey, 'hex');

const ERC20Basic_artifacts = require('../build/contracts/ERC20Basic.json');

let to = "0x110189c51e9b9eebee1ae111c8f28718cf795fef";
let abi = ERC20Basic_artifacts.abi;
let ERC20Basic = web3.eth.contract(abi).at("0x68f2CBdA42eDb8f2A4Da853b34E772A5f8e98Ce0");
let data = ERC20Basic.transfer.getData(to,1000 * Math.pow(10,18));

let gasPrice = web3.eth.gasPrice;
let nonce = web3.eth.getTransactionCount(ethereumCfg.address);

let rawTx = {
    from:ethereumCfg.address,
    to:"0x68f2CBdA42eDb8f2A4Da853b34E772A5f8e98Ce0",
    nonce: web3.toHex(nonce),
    gasPrice: web3.toHex(gasPrice),
    value: '0x00',
    data: data
};
//estimateGas
let gasEstimate = web3.eth.estimateGas(rawTx);
rawTx.gasLimit=web3.toHex(gasEstimate);
let tx = new Tx(rawTx);
tx.sign(privateKey);
let serializedTx = tx.serialize();
console.log("开始====",new Date().getTime());
web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), (err, hash) => {
    console.log("结束====",new Date().getTime());
    if (err)
        console.log("err====",err);
    else
        console.log("hash====",hash);
});*/
