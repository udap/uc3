const ethereumCfg = require('../config/ethereumCfg');
const Web3 = require('web3');

const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(ethereumCfg.provider));

const checkErc721Addr = (ctx,erc721Addr) => {
    if (!erc721Addr || erc721Addr.length == 0)
        ctx.throw("'erc721Addr' param can not be empty");
    if (!web3.isAddress(erc721Addr))
        ctx.throw("'erc721Addr' param not an address");
};

const checkFromAddr = (ctx,from) => {
    if (!from || from.length == 0)
        ctx.throw("'from' param can not be empty");
    if (!web3.isAddress(from))
        ctx.throw("'from' param not an address");
};



module.exports  = { checkErc721Addr:checkErc721Addr,checkFromAddr:checkFromAddr};