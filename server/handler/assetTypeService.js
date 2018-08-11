const Tx = require('ethereumjs-tx');
const ethereumCfg = require('../config/ethereumCfg');
const validator = require('validator');
const AssetType = require('../model/assetType');
const AppRegistry = require('../model/appRegistry');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(ethereumCfg.provider));
const ipfsUtil = require('../util/ipfsUtil');
const fs = require('fs');
const request = require('superagent');

const contract = require('truffle-contract');
const StandardAsset_artifacts = require('../../build/contracts/StandardAsset.json');
const StandardAsset = contract(StandardAsset_artifacts);
const AssetType_artifacts = require('../../build/contracts/AssetType.json');
const AssetTypeContract = contract(AssetType_artifacts);
const udapValidator = require('../common/udapValidator');
const ethereumUtil = require('../util/ethereumUtil');
const Result = require('../common/result');

let privateKey = new Buffer(ethereumCfg.privateKey, 'hex');


const importType =async (ctx) => {

    let fields = ctx.request.body.fields;
    if (!fields) ctx.throw("Please fill in the data");

    // valid data
    let typeAddr = fields.addr;
    let owner = fields.owner;
    let appid = fields.appid;
    udapValidator.isContractAddr(typeAddr,"'typeAddr' param must be a contract address");
    if (!owner || !web3.isAddress(owner))
        ctx.throw("'owner' param isn't an address");
    await udapValidator.appidRegistered(appid);

    let typeCount = await AssetType.count({
        where: {
            gid:appid,
            address:typeAddr
        }
    }).catch((err) => {
        ctx.throw(err.message);
    });
    if (typeCount > 0)
        ctx.throw("Asset Type already exists");


    // request type info
    let type = {
        gid:appid,
        address:typeAddr,
        status:1
    };

    let assetInstance = await StandardAsset.at(typeAddr);

    let allPromise =[assetInstance.name.call({from: owner}).catch((err) => {}),
        assetInstance.symbol.call({from: owner}).catch((err) => {})];
    if (web3.eth.getCode(typeAddr) == StandardAsset_artifacts.deployedBytecode){ //standardAsset
        allPromise.push(assetInstance.getAssetType.call({from: owner}));
    }
    let [name,symbol,typeContractAddr] = await Promise.all(allPromise).catch( err => {
        ctx.throw(err.message);
    });
    if (name)
        type.name = name;
    if (symbol)
        type.symbol = symbol;
    if (typeContractAddr){
        let assetTypeContractInstance = await AssetTypeContract.at(typeContractAddr);

        let uri = assetTypeContractInstance.uri.call({from: owner}).catch( err => {
            ctx.throw(err.message);
        });
        if (uri.startsWith("http:") || uri.startsWith("https:")){
            let res = await request.get(uri.replace("ipfs.io","ipfs.infura.io")).catch( err => {
                ctx.throw(err.message);
            });
            type.icon = JSON.parse(res.body.toString()).icon;
        }
    }
    await AssetType.create(type).catch((err) => {
        ctx.throw(err.message);
    });

    ctx.response.body = Result.success();
};


const create =async (ctx) => {

    let fields = ctx.request.body.fields;
    if (!fields) ctx.throw("Please fill in the data");
    let files = ctx.request.body.files;
    if (!files) ctx.throw("Please upload the icon");

    let action = fields.action;
    if (!action || (action != 'create' && action != 'import'))
        ctx.throw("'action' param error");
    if(action == 'import')
        return importType(ctx);

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
        ctx.throw("'owner' param isn't an address");
    if (!icon || Array.isArray(icon))
        ctx.throw("'icon' param error");
    await udapValidator.appidRegistered(appid);

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
    }).catch((err) => {
        ctx.throw(err.message);
    });
    let txHash = await ethereumUtil.newStandAssert(name,symbol,assetTypeUri).catch((err) => {
        ctx.throw(err.message);
    });

    //address param need web3.eth.getTransactionReceipt success
    // let receipt = web3.eth.getTransactionReceipt(txHash);

    let type = {
        gid:appid,
        icon:buff.toString("base64"),
        name:name,
        symbol:symbol,
        txHash:txHash,
        status:2
    };
    /*if(receipt && receipt.contractAddress)
        type.address = receipt.contractAddress;
    if(receipt && receipt.status)
        type.status = parseInt(receipt.status,16);
    else
        type.status = 2;*/
    await AssetType.create(type).catch((err) => {
        ctx.throw(err.message);
    });

    ctx.response.body = Result.success();
};

const getAll =async (ctx) => {

    let fields = ctx.query;


    if (!fields){
        ctx.throw("Param error");
    }
    let appid = fields.appid;
    let owner = fields.owner;

    await udapValidator.appidRegistered(appid);
    if (!owner || !web3.isAddress(owner))
        ctx.throw("'owner' param isn't an address");

    let where = {gid:appid};
    //query data
    let typeList = await AssetType.findAll(
        { where: where },
        {raw: true}

    ).catch(function (err) {
        ctx.throw(err.message);
    });
    let allPromise =[];
    typeList.forEach((item, index)=>{
        let balancePromise = new Promise(resolve => {resolve(0)});
        let address = item.address;
        if (address && address != null && address.length >0){
            balancePromise = StandardAsset.at(item.address)
                .then(instance => {
                    return instance.balanceOf.call(owner,{from: owner});
                }).catch((err) => {});
        }
        allPromise.push(balancePromise);
    });
    let allBalances = await Promise.all(allPromise).catch((err) => {ctx.throw(err)});
    let content = [];
    typeList.forEach((item, index)=>{
        let temp = item.toJSON();
        temp.balance = allBalances[index]?allBalances[index]:0;
        content.push(temp);
    });
    //response
    ctx.response.body = Result.success(content);
};

module.exports  = { create:create,getAll:getAll};
