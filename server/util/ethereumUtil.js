const Web3 = require('web3');
const web3 = new Web3();
const Tx = require('ethereumjs-tx');
const ethereumCfg = require('../config/ethereumCfg');
const privateKey = new Buffer(ethereumCfg.privateKey, 'hex');
const standardAsset_artifacts = require('..\\build\\contracts\\StandardAsset.json');
web3.setProvider(new web3.providers.HttpProvider(ethereumCfg.provider));


const newStandAssert = (name,symbol,uri) =>{
    let abi = standardAsset_artifacts.abi;
    let bytecode = standardAsset_artifacts.bytecode;
    let standardAsset = web3.eth.contract(abi);
    let contractData = standardAsset.new.getData(name,symbol,uri,{data:bytecode});

    let gasPrice = web3.eth.gasPrice;
    let gasPriceHex = web3.toHex(gasPrice);
    let nonce = web3.eth.getTransactionCount(ethereumCfg.address);
    let nonceHex = web3.toHex(nonce);
    //estimateGas
    let gasEstimate = web3.eth.estimateGas({data: contractData});
    let gasLimitHex = web3.toHex(gasEstimate);
    let rawTx = {
        nonce: nonceHex,
        gasPrice: gasPriceHex,
        gasLimit: gasLimitHex,
        value: '0x00',
        data: contractData
    };
    let tx = new Tx(rawTx);
    tx.sign(privateKey);
    let serializedTx = tx.serialize();
    return new Promise((resolve,reject) => {
        web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), (err, hash) => {
            if (!err)
                resolve(hash);
            else
                reject(err);
        });
    }).catch((err)=>{
        throw err;
    })
}
module.exports  = { newStandAssert:newStandAssert};