const Web3 = require('web3');
const ethereumCfg = require('../config/ethereumCfg');
const web3 = new Web3(new Web3.providers.HttpProvider(ethereumCfg.provider));
const Tx = require('ethereumjs-tx');
const privateKey = Buffer.from(ethereumCfg.privateKey, 'hex');
const standardAsset_artifacts = require('../../build/contracts/StandardAsset.json');
const harvestRegistrar_artifacts = require('../../build/contracts/HarvestRegistrar.json');
const harvestRegistrarAddr = harvestRegistrar_artifacts.networks[web3.version.network].address;
const TxSent = require('../model/txSent');
const uuidv4 = require('uuid/v4');

const newStandardAsset = (name,symbol,supplyLimit,uri,owner) =>{
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

const mint = async (typeAddr,to,uri,owner) =>{
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
    let txHash = new Promise((resolve,reject) => {
        web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), (err, hash) => {
            if (!err)
                resolve(hash);
            else
                reject(err);
        });
    }).catch((err)=>{
        throw err;
    });
    rawTx.bizType = "StandardAsset_mint";
    rawTx.bizId = uuidv4();
    rawTx.txHash = txHash;
    rawTx.status = 2;
    rawTx.owner = owner;
    await TxSent.create(rawTx).catch((err) => {
        throw err;
    });
    return txHash;
};


let createTx = async (to,data,value) =>  {
    let gasPrice = web3.eth.gasPrice;
    let nonce = web3.eth.getTransactionCount(ethereumCfg.address);
    let rawTx = {
        from:ethereumCfg.address,
        to:to,
        nonce: web3.toHex(nonce),
        gasPrice: web3.toHex(gasPrice),
        value: value,//'0x00',
        data: data
    };
    //estimateGas
    let gasEstimate = web3.eth.estimateGas(rawTx);
    rawTx.gasLimit=web3.toHex(gasEstimate);
    let tx = new Tx(rawTx);
    tx.sign(privateKey);
    let serializedTx = tx.serialize();
    let txHash = new Promise((resolve,reject) => {
        web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), (err, hash) => {
            if (!err)
                resolve(hash);
            else
                reject(err);
        });
    }).catch((err)=>{
        throw err;
    });
    rawTx.txHash = txHash;
    return rawTx;
};


let registerSubdomain = async (label,subdomain,owner,sig) =>{
    let abi = harvestRegistrar_artifacts.abi;
    let HarvestRegistrar = web3.eth.contract(abi).at(harvestRegistrarAddr);
    let data = HarvestRegistrar.register.getData(label,subdomain,owner,sig);
    let rawTx = await createTx(HarvestRegistrar.address,data,'0x00');
    rawTx.bizType = "HarvestRegistrar_register";
    rawTx.bizId = uuidv4();
    rawTx.status = 2;
    rawTx.owner = txSender;
    await TxSent.create(rawTx).catch((err) => {
        throw err;
    });
    return rawTx.txHash;
}


module.exports  = { newStandardAsset:newStandardAsset,mint:mint,registerSubdomain:registerSubdomain};