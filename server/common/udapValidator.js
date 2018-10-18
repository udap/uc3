const ethereumCfg = require('../config/ethereumCfg');
const Web3 = require('web3');

const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(ethereumCfg.provider));
const AppRegistry = require('../model/appRegistry');
const validator = require('validator');


const appidRegistered = async (appid) => {
    if(!appid)
        throw "'appid' param cannot be empty";
    /*let count = await AppRegistry.count({
        where: {
            gid:appid
        }
    }).catch((err) => {
        throw err.message;
    });
    if (count = 0)
        ctx.throw("appid not registered");*/
};

const isContractAddr = (address,message) => {
    message = message?message:'not a contract address';
    if (!address || !web3.isAddress(address))
        throw message;
    let byteCode = web3.eth.getCode(address);//byteCode
    if(byteCode === '0x') throw message;
};
const isValidJson = (json)=> {
        if(typeof(json) == "object"){
            return Object.prototype.toString.call(json).toLowerCase() == "[object object]" && !json.length;
        }else if (typeof(json) == "string"){
            return validator.isJSON(json);
        }else{
            return false;
        }
}
const isDomainName = (domainName)=> {
    if(typeof(domainName) == "string" &&(domainName.endsWith(".eth") || domainName.endsWith(".test")) ){
        return true;
    }else{
        return false;
    }
}

module.exports  = {
    appidRegistered:appidRegistered,
    isContractAddr:isContractAddr,
    isValidJson:isValidJson,
    isDomainName:isDomainName
};