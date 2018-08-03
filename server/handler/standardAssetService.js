const contract = require('truffle-contract');
const standardAsset_artifacts = require('../../build/contracts/StandardAsset.json');
const StandardAsset = contract(standardAsset_artifacts);
const ethereumCfg = require('../config/ethereumCfg');
const result = require('../common/result');
const udapValidator = require('../common/udapValidator');
const pagerhelper = require('../common/pagerhelper');

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

    udapValidator.checkErc721Addr(ctx,erc721Addr);
    udapValidator.checkFromAddr(ctx,from);

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

    //response
    ctx.response.body = result.success(content);
};

const tokenOfOwnerByIndex =async (ctx) => {

    let fields = ctx.query;

    if (!fields){
        ctx.throw("Param error");
    }
    let index = fields.index;
    let from = fields.from;
    let erc721Addr = fields.erc721Addr;


    udapValidator.checkErc721Addr(ctx,erc721Addr);
    udapValidator.checkFromAddr(ctx,from);

    if (!index || index.length == 0)
        ctx.throw("'index' param can not be empty");

    let content = {};
    await StandardAsset.at(erc721Addr).then(instance => {
        return instance.tokenOfOwnerByIndex.call(from,index,{from: from})
    }).then(tokenId => {
        content.tokenId = tokenId;
    }).catch( err => {
        ctx.throw(err.message);
    });

    //response
    ctx.response.body = result.success(content);
};

const tokenInfo = async (ctx) => {

    let fields = ctx.query;

    if (!fields){
        ctx.throw("Param error");
    }
    let from = fields.from;
    let erc721Addr = fields.erc721Addr;
    let pageSize = 10;// default 10
    let pageNo = 1;

    udapValidator.checkErc721Addr(ctx,erc721Addr);
    udapValidator.checkFromAddr(ctx,from);

    if (fields.pageNo)
        pageNo = parseInt(fields.pageNo);
    if (fields.pageSize)
        pageSize = parseInt(fields.pageSize);

    let instance = await StandardAsset.at(erc721Addr);

    let totalCount = await instance.balanceOf.call(from,{from: from});
    let start = pagerhelper.calcStart(pageNo,pageSize);
    let end = pagerhelper.calcEnd(pageNo,pageSize,totalCount);

    let tokenIdPromise = [];
    for(let index = start;index < end ;index++){
        tokenIdPromise.push(instance.tokenOfOwnerByIndex.call(from,index,{from: from}));
    }
    let tokenIds = await Promise.all(tokenIdPromise);

    let tokenUriPromise = [];
    for(let i = 0;i < tokenIds.length ;i++){
        tokenUriPromise.push(instance.tokenURI.call(tokenIds[i],{from: from}));
    }
    let tokenURIs = await Promise.all(tokenUriPromise);

    let tokens = [];
    for(let i = 0;i < tokenIds.length ;i++){
        let token = {
            tokenId:tokenIds[i],
            tokenURI:tokenURIs[i]
        };
        tokens.push(token);
    }


    let content = {
        tokens : tokens,
        pager :pagerhelper.getPager(pageNo,pageSize,totalCount)
    };

    //response
    ctx.response.body = result.success(content);
};




module.exports  = { loadErc721:loadErc721,tokenOfOwnerByIndex:tokenOfOwnerByIndex,tokenInfo:tokenInfo};