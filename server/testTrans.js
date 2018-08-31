const Web3 = require('web3');
const Tx = require('ethereumjs-tx');

let ethereumCfg = {
    provider: 'https://ropsten.infura.io/HUkrzYiEqgEioBDoT5Mq',
    address: '0xcabe9a163B96865308605bdE13233FD1A0610931',
    privateKey: '816a873c934de69b966d34a2bd464be55de47aea11deeb554de23d2b8b8b8f93'
};
const web3 = new Web3(new Web3.providers.HttpProvider(ethereumCfg.provider));

web3.eth.getTransactionReceipt("0xa349f882e3f1cdf9cc48501f825f3b429f8cf2e4620f1efcae3b2cdffc960b09",(err, receipt) => {
    if (err)
        console.log(err);
    else
        console.log(receipt);
});

web3.eth.getTransaction("0xa349f882e3f1cdf9cc48501f825f3b429f8cf2e4620f1efcae3b2cdffc960b09",(err, receipt) => {

    console.log("getTransaction==========================");
    if (err)
        console.log(err);
    else
        console.log(receipt);
})


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
