const Web3 = require('web3');
const web3 = new Web3();
const ethereumCfg = require('../config/ethereumCfg');


const getId = (address,name)=>{
    return web3.sha3(address + "@" + name);
};


module.exports  = { getId:getId};