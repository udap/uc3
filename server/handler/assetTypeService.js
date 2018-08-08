const Tx = require('ethereumjs-tx');
const ethereumCfg = require('../config/ethereumCfg');
const validator = require('validator');
const AssetType = require('../model/assetType');
const AppRegistry = require('../model/appRegistry');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(ethereumCfg.provider));
const ipfsUtil = require('../util/ipfsUtil');
const fs = require('fs');

const contract = require('truffle-contract');
const StandardAsset_artifacts = require('../../build/contracts/StandardAsset.json');
const StandardAsset = contract(StandardAsset_artifacts);


const ethereumUtil = require('../util/ethereumUtil');


const Result = require('../common/result');

let privateKey = new Buffer(ethereumCfg.privateKey, 'hex');


const create =async (ctx) => {

    let fields = ctx.request.body.fields;
    if (!fields) ctx.throw("Please fill in the data");
    let files = ctx.request.body.files;
    if (!files) ctx.throw("Please upload the icon");

    let action = fields.action;
    if (!action || (action != 'create' && action != 'import'))
        ctx.throw("'action' param error");

    let name = fields.name;
    let symbol = fields.symbol;
    let desc = fields.desc;
    let owner = fields.owner;
    let icon = files.icon;
    let appid = fields.appid;

    if (!name || !validator.isLength(name,{min:1, max: 45}))
        ctx.throw("'name' param cannot be empty and the max length is 45");
    if (!symbol || !validator.isLength(symbol,{min:1, max: 45}))
        ctx.throw("'symbol' param cannot be empty and the max length is 45");
    if (!owner || !web3.isAddress(owner))
        ctx.throw("'web3' isn't an address");
    if (!icon || Array.isArray(icon))
        ctx.throw("'icon' param error");
    if(!appid)
        ctx.throw("'appid' param cannot be empty");
    let count = await AppRegistry.count({
        where: {
            gid:appid
        }
    }).catch((err) => {
        ctx.throw(err.message);
    });
    if (count = 0)
        ctx.throw("appid not registered");

    let typeCount = await AssetType.count({
        where: {
            gid:appid,
            name:name,
            symbol:symbol
        }
    }).catch((err) => {
        ctx.throw(err.message);
    });
    if (typeCount > 0)
        ctx.throw("AssetType already exists");

    //upload file to ipfs
    let buff = fs.readFileSync(icon.path);
    // let iconHash = await ipfsUtil.addFile(buff);
    let assetTypeUri = await ipfsUtil.addJson({
        desc:desc,
        icon:buff.toString("base64")
    });
    let txHash = await ethereumUtil.newStandAssert(name,symbol,assetTypeUri);

    //address param need web3.eth.getTransactionReceipt success
    let receipt = web3.eth.getTransactionReceipt(txHash);

    let type = {
        gid:appid,
        address:receipt.contractAddress,
        icon:buff.toString("base64"),
        name:name,
        symbol:symbol,
        txHash:txHash,
        status:parseInt(receipt.status,16)
    };
    await AssetType.create(type).catch((err) => {
        ctx.throw(err.message);
    });

    ctx.response.body = Result.success();
};

module.exports  = { create:create};
