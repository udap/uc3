const contract = require('truffle-contract');
const standardAsset_artifacts = require('../../build/contracts/StandardAsset.json');
const StandardAsset = contract(standardAsset_artifacts);
let ethereumCfg = require('../config/ethereumCfg');

const Web3 = require('web3');
const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(ethereumCfg.provider));
StandardAsset.setProvider(web3.currentProvider);



const loadErc721 =async (ctx) => {

    let fields = ctx.query;


    if (!fields){
        ctx.throw("Param error");
    }
    let erc721Addr = fields.erc721Addr;
    let from = fields.from;

    if (!erc721Addr || erc721Addr.length == 0)
        ctx.throw("'erc721Addr' param can not be empty");
    if (!web3.isAddress(erc721Addr))
        ctx.throw("'erc721Addr' param not an address");
    if (!from || from.length == 0)
        ctx.throw("'from' param can not be empty");
    if (!web3.isAddress(from))
        ctx.throw("'from' param not an address");

    let content = {};
    let instance;
    await StandardAsset.at(erc721Addr).then(inst => {
        instance = inst;
        return instance.name.call({from: from})
    }).then(name => {
        content.name = name;
        return instance.symbol.call({from: from})
    }).then(symbol => {
        content.symbol = symbol;
        return instance.balanceOf.call(from,{from: from})
    }).then(balance => {
        content.balance = balance;
    }).catch( err => {
        ctx.throw(err.message);
    });

    //响应
    ctx.response.body = {
        code: 1,
        message: "success",
        content:content
    };
};

module.exports  = { loadErc721:loadErc721};