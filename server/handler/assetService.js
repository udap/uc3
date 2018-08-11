const contract = require('truffle-contract');
const Result = require('../common/result');
const udapValidator = require('../common/udapValidator');

const Web3 = require('web3');
const web3 = new Web3();
const ethereumCfg = require('../config/ethereumCfg');
web3.setProvider(new web3.providers.HttpProvider(ethereumCfg.provider));
const standardAsset_artifacts = require('../../build/contracts/StandardAsset.json');
const StandardAsset = contract(standardAsset_artifacts);
StandardAsset.setProvider(web3.currentProvider);


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



module.exports  = { mint:mint};