const ethereumCfg = require('../config/ethereumCfg');
const Web3 = require('web3');

const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(ethereumCfg.provider));
const AppRegistry = require('../model/appRegistry');

const appidRegistered = async (appid) => {
    if(!appid)
        throw "'appid' param cannot be empty";
    let count = await AppRegistry.count({
        where: {
            gid:appid
        }
    }).catch((err) => {
        throw err.message;
    });
    if (count = 0)
        ctx.throw("appid not registered");
};

const isContractAddr = (address,message) => {
    message = message?message:'not a contract address';
    if (!address || !web3.isAddress(address))
        throw message;
    let byteCode = web3.eth.getCode(address);//byteCode
    if(byteCode === '0x') throw message;
};

module.exports  = { appidRegistered:appidRegistered,isContractAddr:isContractAddr};