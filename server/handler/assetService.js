const contract = require('truffle-contract');
const Result = require('../common/result');
const validator = require('validator');
const udapValidator = require('../common/udapValidator');
const ipfsUtil = require('../util/ipfsUtil');
const ethereumUtil = require('../util/ethereumUtil');
const signUtil = require('../util/signUtil');

const fs = require('fs');
const Web3 = require('web3');
const web3 = new Web3();
const ethereumCfg = require('../config/ethereumCfg');
web3.setProvider(new web3.providers.HttpProvider(ethereumCfg.provider));
const standardAsset_artifacts = require('../../build/contracts/StandardAsset.json');
const StandardAsset = contract(standardAsset_artifacts);
StandardAsset.setProvider(web3.currentProvider);
const request = require('superagent');


const mint =async (ctx) => {

    let fields = ctx.request.body.fields;
    if (!fields) ctx.throw("Please fill in the data");
    let files = ctx.request.body.files;
    if (!files) ctx.throw("Please upload the image");

    let owner = fields.owner;
    let typeAddr = fields.typeAddr;
    let to = fields.to;
    let id = fields.id;
    let name = fields.name;
    let desc = fields.desc;
    let image = files.image;
    let imageHex = files.imageHex;
    let attributes = files.attributes;
    let appid = fields.appid;
    let sig = files.sig;
    delete fields["sig"];

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


    if(!signUtil.verifySha3Sig(owner,fields,sig)){
        ctx.throw("signature error");
    }

    //upload file to ipfs
    let buff = fs.readFileSync(image.path);
    if(!signUtil.verifySha3(imageHex,buff)){
        ctx.throw("imageHex error");
    }

    let metadataObj = {
        name:name,
        description:desc
    };
    if(id)
        metadataObj.id = id;
    if(attributes)
        metadataObj.attributes = attributes;

    let imageUri = await ipfsUtil.addFile(buff).catch((err) => {
        ctx.throw(err);
    });
    metadataObj.image = imageUri;
    let metadataUri = await ipfsUtil.addJson(metadataObj).catch((err) => {
        ctx.throw(err);
    });
    let txHash = await ethereumUtil.newAssert(typeAddr,to,metadataUri,owner).catch((err) => {
        ctx.throw(err);
    });

    ctx.response.body = Result.success(txHash);
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

    let tokenUriPromise = [];
    tokenIds.forEach((item,index)=>{
        tokenUriPromise.push(instance.tokenURI.call(item,{from: owner}));
    });
    let tokenURIs = await Promise.all(tokenUriPromise).catch((err) => {
        ctx.throw(err);
    });


    //get  tokenURIs
    let metadataPromises = [];
    tokenURIs.forEach((item,index)=>{
        let pro;
        if (item && (item.startsWith("http") || item.startsWith("https"))){
            pro = request.get(item.replace("https://ipfs.io","http://127.0.0.1:8080")).then(res =>{
                return res.body;
            });
        }else {
            pro = new Promise((resolve,reject) => {reject(item)})
        }
        metadataPromises.push(pro);
    });

    //get  metadatas
    let metadatas = await Promise.all(metadataPromises).catch((err) => {
        ctx.throw(err);
    });

    //tokens result
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


const createMetadata =async (ctx) => {

    let fields = ctx.request.body.fields;
    if (!fields) ctx.throw("Please fill in the data");
    let files = ctx.request.body.files;
    if (!files) ctx.throw("Please upload the image");

    let id = fields.id;
    let name = fields.name;
    let desc = fields.desc;
    let image = files.image;
    let appid = fields.appid;
    let attributes = fields.attributes;

    if (!name || !validator.isLength(name,{min:1, max: 45}))
        ctx.throw("'name' param cannot be empty and the max length is 45");
    if (!desc || !validator.isLength(desc,{min:1, max: 255}))
        ctx.throw("'desc' param cannot be empty and the max length is 45");
    if (!image || Array.isArray(image))
        ctx.throw("'image' param error");

    await udapValidator.appidRegistered(appid);

    let metadata = {
        name:name,
        description:desc
    };
    if(id)
        metadata.id = id;
    if(attributes)
        metadata.attributes = JSON.parse(attributes);

    //upload file to ipfs
    let buff = fs.readFileSync(image.path);
    let imageUri = await ipfsUtil.addFile(buff).catch((err) => {
        ctx.throw(err);
    });
    metadata.image = imageUri;
    let metadataUri = await ipfsUtil.addJson(metadata).catch((err) => {
        ctx.throw(err);
    });
    ctx.response.body = Result.success(metadataUri);
};



module.exports  = { mint:mint,getAllByOwner:getAllByOwner,createMetadata:createMetadata};