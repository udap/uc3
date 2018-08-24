const Web3 = require('web3');
const web3 = new Web3();
const Tx = require('ethereumjs-tx');
const ethereumCfg = require('../config/ethereumCfg');
const privateKey = new Buffer(ethereumCfg.privateKey, 'hex');
const standardAsset_artifacts = require('../../build/contracts/StandardAsset.json');
web3.setProvider(new web3.providers.HttpProvider(ethereumCfg.provider));


const newStandAssert = (name,symbol,supplyLimit,uri,owner) =>{
    let abi = standardAsset_artifacts.abi;
    let standardAsset = web3.eth.contract(abi);
    let contractData = standardAsset.new.getData(name,symbol,supplyLimit,uri,owner,{data:standardAsset_artifacts.bytecode});

    let gasPrice = web3.eth.gasPrice;
    let nonce = web3.eth.getTransactionCount(ethereumCfg.address);

    let rawTx = {
        from:ethereumCfg.address,
        nonce: web3.toHex(nonce),
        gasPrice: web3.toHex(gasPrice),
        value: '0x00',
        data: contractData
    };
    //estimateGas
    let gasEstimate = web3.eth.estimateGas(rawTx);
    rawTx.gasLimit=web3.toHex(gasEstimate);
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
};

const newAssert = (typeAddr,to,uri) =>{
    let abi = standardAsset_artifacts.abi;
    let standardAsset = web3.eth.contract(abi).at(typeAddr);
    let data = standardAsset.mint.getData(to,uri);

    let gasPrice = web3.eth.gasPrice;
    let nonce = web3.eth.getTransactionCount(ethereumCfg.address);

    let rawTx = {
        from:ethereumCfg.address,
        to:typeAddr,
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
module.exports  = { newStandAssert:newStandAssert,newAssert:newAssert};