const contract = require('truffle-contract');
const Result = require('../common/result');
const validator = require('validator');
const udapValidator = require('../common/udapValidator');
const ipfsUtil = require('../util/ipfsUtil');
const ethereumUtil = require('../util/ethereumUtil');

const fs = require('fs');
const Web3 = require('web3');
const web3 = new Web3();
const ethereumCfg = require('../config/ethereumCfg');
web3.setProvider(new web3.providers.HttpProvider(ethereumCfg.provider));
const standardAsset_artifacts = require('../../build/contracts/StandardAsset.json');
const StandardAsset = contract(standardAsset_artifacts);
StandardAsset.setProvider(web3.currentProvider);
const request = require('superagent');


const MintRecord = require('../model/mintRecord');



const mint =async (ctx) => {

    let fields = ctx.request.body.fields;
    if (!fields) ctx.throw("Please fill in the data");
    let files = ctx.request.body.files;
    if (!files) ctx.throw("Please upload the image");

    let typeAddr = fields.typeAddr;
    let to = fields.to;
    let name = fields.name;
    let desc = fields.desc;
    let image = files.image;
    let owner = fields.owner;
    let appid = fields.appid;

    if (!typeAddr)
        ctx.throw("'typeAddr' param cannot be empty");
    udapValidator.isContractAddr(typeAddr,"'typeAddr' must be contract");

    if (!to || !web3.isAddress(to))
        ctx.throw("'to' param error");

    if (!name || !validator.isLength(name,{min:1, max: 45}))
        ctx.throw("'name' param cannot be empty and the max length is 45");
    if (!desc || !validator.isLength(desc,{min:1, max: 255}))
        ctx.throw("'desc' param cannot be empty and the max length is 45");
    if (!image || Array.isArray(image))
        ctx.throw("'image' param error");

    if (!owner || !web3.isAddress(owner))
        ctx.throw("'owner' param isn't an address");
    await udapValidator.appidRegistered(appid);

    //upload file to ipfs
    let buff = fs.readFileSync(image.path);
    let metadataUri = await ipfsUtil.addJson({
        name:name,
        description:desc,
        image:buff.toString("base64")
    }).catch((err) => {
        ctx.throw(err);
    });
    let txHash = await ethereumUtil.newAssert(typeAddr,to,metadataUri).catch((err) => {
        ctx.throw(err);
    });

    let record = {
        gid:appid,
        typeAddr:typeAddr,
        to:to,
        name:name,
        desc:desc,
        image:buff.toString("base64"),
        owner:owner,
        txHash:txHash,
        status:2
    };
    await MintRecord.create(record).catch((err) => {
        ctx.throw(err);
    });

    ctx.response.body = Result.success();
};


const getAllByOwner =async (ctx) => {

    let fields = ctx.query;

    //valid
    if (!fields){
        ctx.throw("Param error");
    }
    let typeAddr = fields.typeAddr;
    let owner = fields.owner;
    let appid = fields.appid;

    udapValidator.isContractAddr(typeAddr,"'typeAddr' param must be contract address")
    await udapValidator.appidRegistered(appid);

    //get instance
    let instance = await StandardAsset.at(typeAddr);
    let totalCount = await instance.balanceOf.call(owner,{from: owner}).catch((err) => {
        ctx.throw(err);
    });
    let tokenIdsPromise = [];
    for(let index = 0;index < totalCount ;index++){
        let idPromise=instance.tokenOfOwnerByIndex.call(owner,index,{from: owner});
        tokenIdsPromise.push(idPromise);
    }
    //get tokenIds
    let tokenIds = await Promise.all(tokenIdsPromise).catch((err) => {
        ctx.throw(err);
    });
    tokenIds.filter(tid => tid);

    let tokenUriPromise = [];
    tokenIds.forEach((item,index)=>{
        tokenUriPromise.push(instance.tokenURI.call(item,{from: owner}));
    });
    let tokenURIs = await Promise.all(tokenUriPromise).catch((err) => {
        ctx.throw(err);
    });


    let metadataPromises = [];
    tokenURIs.forEach((item,index)=>{
        let pro;
        if (item && (item.startsWith("http") || item.startsWith("https"))){
            pro = request.get(item.replace("ipfs.io","ipfs.infura.io")).then(res =>{
                return res.body;
            });
        }else {
            pro = new Promise((resolve,reject) => {reject(item)})
        }
        metadataPromises.push(pro);
    });
    let metadatas = await Promise.all(metadataPromises).catch((err) => {
        ctx.throw(err);
    });
    let tokens = [];
    tokenIds.forEach((item,index)=>{
        let token = {
            tokenId:item
        };
        if (tokenURIs[index])
            token.tokenURI = tokenURIs[index];
        if(metadatas[index])
            token.metadata = metadatas[index];
        tokens.push(token);
    });
    ctx.response.body = Result.success(tokens);
};



module.exports  = { mint:mint,getAllByOwner:getAllByOwner};