const ethereumCfg = require('../config/ethereumCfg');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(ethereumCfg.provider));
const contract = require('truffle-contract');
const TxRelay_artifacts = require('../../build/contracts/TxRelay');
const TxRelay = contract(TxRelay_artifacts);
TxRelay.setProvider(web3.currentProvider);
const Result = require('../common/result');

const getNonce = async (ctx) => {

    let fields = ctx.query;
    if (!fields) ctx.throw("no param ");

    // valid data
    let sender = fields.sender;
    let appid = fields.appid;
    if (!sender || !web3.isAddress(sender))
        ctx.throw("'sender' param error");
    await udapValidator.appidRegistered(appid);



    let nonce = await TxRelay.deployed().then(instance =>{
        return instance.getNonce(sender,{from: sender});
    }).catch(err => {ctx.throw(err)});

    let content = {nonce:nonce};

    ctx.response.body = Result.success(content);
};



module.exports  = { getNonce:getNonce};

