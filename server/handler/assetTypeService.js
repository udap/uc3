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
StandardAsset.setProvider(web3.currentProvider);
const AssetType_artifacts = require('../../build/contracts/AssetType.json');
const AssetTypeContract = contract(AssetType_artifacts);
AssetTypeContract.setProvider(web3.currentProvider);

const DetailedERC20_artifacts = require('../../build/contracts/DetailedERC20.json');
const DetailedERC20 = contract(DetailedERC20_artifacts);
DetailedERC20.setProvider(web3.currentProvider);
const udapValidator = require('../common/udapValidator');
const ethereumUtil = require('../util/ethereumUtil');
const Result = require('../common/result');

let privateKey = new Buffer(ethereumCfg.privateKey, 'hex');


const importType =async (ctx) => {


    let fields = ctx.request.body.fields;
    if (!fields) fields = ctx.request.body;
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
        status:1,
        type:"ERC721"
    };

    let assetInstance = await StandardAsset.at(typeAddr);

    let allPromise =[assetInstance.name.call({from: owner}).catch((err) => {}),
        assetInstance.symbol.call({from: owner}).catch((err) => {})];
    allPromise.push(assetInstance.getAssetType.call({from: owner}));
    let [name,symbol,typeContractAddr] = await Promise.all(allPromise).catch( err => {
        ctx.throw(err);
    });
    if (name)
        type.name = name;
    if (symbol)
        type.symbol = symbol;
    if (typeContractAddr){
        type.type = "UPA";

        let uri = await  AssetTypeContract.at(typeContractAddr).uri.call({from: owner}).catch( err => {
            ctx.throw(err);
        });
        if (uri && (uri.startsWith("http:") || uri.startsWith("https:"))){
            let uriData = await ipfsUtil.getJson(uri);
            type.icon = uriData.icon
        }
    }
    await AssetType.create(type).catch((err) => {
        ctx.throw(err.message);
    });

    ctx.response.body = Result.success();
};


const create =async (ctx) => {
    let fields = ctx.request.body.fields;
    if(!fields)
        fields = ctx.request.body;
    if (!fields) ctx.throw("Please fill in the data");
    let action = fields.action;
    if (!action || (action != 'create' && action != 'import'))
        ctx.throw("'action' param error");
    if(action == 'import')
        return importType(ctx);


    let files = ctx.request.body.files;
    if (!files) ctx.throw("Please upload the icon");

    let name = fields.name;
    let symbol = fields.symbol;
    let supplyLimit = fields.supplyLimit;
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
    if(!supplyLimit)
        supplyLimit = 0;
    await udapValidator.appidRegistered(appid);

    let typeCount = await AssetType.count({
        where: {
            gid:appid,
            name:name,
            symbol:symbol
        }
    }).catch((err) => {
        ctx.throw(err);
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
        ctx.throw(err);
    });
    let txHash = await ethereumUtil.newStandAssert(name,symbol,supplyLimit,assetTypeUri,owner).catch((err) => {
        ctx.throw(err);
    });

    //address param need web3.eth.getTransactionReceipt success
    // let receipt = web3.eth.getTransactionReceipt(txHash);

    let type = {
        gid:appid,
        icon:buff.toString("base64"),
        name:name,
        symbol:symbol,
        txHash:txHash,
        status:2,
        type:"UPA"
    };
    /*if(receipt && receipt.contractAddress)
        type.address = receipt.contractAddress;
    if(receipt && receipt.status)
        type.status = parseInt(receipt.status,16);
    else
        type.status = 2;*/
    await AssetType.create(type).catch((err) => {
        ctx.throw(err);
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
        { where: where ,order: [['id', 'ASC']]}
    ).catch(function (err) {
        ctx.throw(err.message);
    });
    let allBalancesPromise =[];
    let allDecimalsPromise = [];
    let allOwnerPromise = [];

    typeList.forEach((item, index)=>{
        let balancePromise = new Promise(resolve => {resolve(0)});
        let decimalsPromise = new Promise(resolve => {resolve(0)});
        let ownerPromise = new Promise(resolve => {resolve(0)});
        let address = item.address;
        if (address && address != null && address.length >0){
            balancePromise = StandardAsset.at(item.address).then(instance => {
                return instance.balanceOf.call(owner,{from: owner});
            }).catch(err => {});
            if(item.type == "ERC20"){
                decimalsPromise = DetailedERC20.at(item.address).then(instance => {
                    return instance.decimals.call({from: owner});
                }).catch(err => {});
            }
            if(item.type == "UPA"){
                ownerPromise = StandardAsset.at(item.address).then(instance => {
                    return instance.owner.call({from: owner});
                }).catch(err => {});
            }

        }
        allBalancesPromise.push(balancePromise);
        allDecimalsPromise.push(decimalsPromise);
        allOwnerPromise.push(ownerPromise);
    });
    let allBalances = await Promise.all(allBalancesPromise).catch(err => {ctx.throw(err)});
    let allDecimals = await Promise.all(allDecimalsPromise).catch(err => {ctx.throw(err)});
    let allOwner = await Promise.all(allOwnerPromise).catch(err => {ctx.throw(err)});
    let content = [];
    typeList.forEach((item, index)=>{
        let temp = item.toJSON();
        let balance = allBalances[index]?allBalances[index]:0;
        temp.balance = balance;
        if(balance >0){
            let decimals = allDecimals[index]?allDecimals[index]:0;
            temp.balance = balance.dividedBy(Math.pow(10,decimals)).toFixed(decimals);
        }
        temp.isOwner = false;
        if(temp.type == "UPA")
            temp.isOwner = allOwner[index] == owner;
        content.push(temp);
    });
    //response
    ctx.response.body = Result.success(content);
};

module.exports  = { create:create,getAll:getAll};
