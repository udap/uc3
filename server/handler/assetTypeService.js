const Tx = require('ethereumjs-tx');
const ethereumCfg = require('../config/ethereumCfg');
const validator = require('validator');
const AssetType = require('../model/assetType');
const AppRegistry = require('../model/appRegistry');
const ViewTemplate = require('../model/viewTemplate');
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
const InterfaceIds = require('../util/InterfaceIds');
const Result = require('../common/result');
const Sequelize = require('sequelize');

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
        status:1
    };

    let assetInstance = await StandardAsset.at(typeAddr);
    let support721 = await assetInstance.supportsInterface.call(InterfaceIds.InterfaceId_ERC721,{from: owner}).catch((err) => {});
    if(support721 && support721)
        type.type = "ERC721";
    else
        ctx.throw("only support ERC721 import");

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
            let metadata = await ipfsUtil.getJson(uri);
            type.metadata = metadata
        }
    }
    let result = await AssetType.create(type).catch((err) => {
        ctx.throw(err.message);
    });

    ctx.response.body = Result.success(result.id);
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
    let icon = files.icon;
    let owner = fields.owner;
    let appid = fields.appid;

    let schemaSrc = fields.schemaSrc;
    let views = fields.views;


    if (!name || !validator.isLength(name,{min:1, max: 45}))
        ctx.throw("'name' param cannot be empty and the max length is 45");
    if (!symbol || !validator.isLength(symbol,{min:1, max: 45}))
        ctx.throw("'symbol' param cannot be empty and the max length is 45");
    if (!owner || !web3.isAddress(owner))
        ctx.throw("'owner' param isn't an address");
    if (!icon || Array.isArray(icon))
        ctx.throw("'icon' param error");
    if (!schemaSrc || (!validator.isJSON(schemaSrc) && !validator.isURL(schemaSrc)))
        ctx.throw("'schemaSrc' param error");
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

    let iconUri = await ipfsUtil.addFile(buff).catch((err) => {
        ctx.throw(err);
    });
    if(schemaSrc && (schemaSrc.startsWith("http://") || schemaSrc.startsWith("https://"))){
        let res = await request.get(schemaSrc).catch( err => {
            throw err;
        });
        if(res && res.text){
            schemaSrc = res.text;
        }
    }
    let metadata = {
        name:name,
        symbol:symbol,
        desc:desc?desc:"",
        icon:iconUri,
        schema:schemaSrc,
        views:views?views:[]
    };
    console.log("ipfsUtil.addJson=====",JSON.stringify(metadata));
    let metadataUri = await ipfsUtil.addJson(metadata).catch((err) => {
        ctx.throw(err);
    });
    let txHash = await ethereumUtil.newStandAssert(name,symbol,supplyLimit,metadataUri,owner).catch((err) => {
        ctx.throw(err);
    });

    let type = {
        gid:appid,
        metadata:JSON.stringify(metadata),
        name:name,
        symbol:symbol,
        txHash:txHash,
        status:2,
        type:"UPA"
    };
    let result = await AssetType.create(type).catch((err) => {
        ctx.throw(err);
    });

    ctx.response.body = Result.success(result.id);
};

const getAll =async (ctx) => {

    let fields = ctx.query;


    if (!fields){
        ctx.throw("Param error");
    }
    let filter = fields.filter;
    if(filter && filter == "default")
        return getDefaultUPA(ctx);

    let appid = fields.appid;
    let owner = fields.owner;

    await udapValidator.appidRegistered(appid);
    if (!owner || !web3.isAddress(owner))
        ctx.throw("'owner' param isn't an address");

    let where = {
        [Sequelize.Op.or]: [{gid: '0'}, {gid:appid}]
    };
    //query data
    let typeList = await AssetType.findAll(
        {
            where: where,
            order: [['id', 'ASC']]
        }
    ).catch(function (err) {
        ctx.throw(err.message);
    });
    let allBalancesPromise =[];
    let allDecimalsPromise = [];
    let allOwnerPromise = [];
    let allControllerPromise = [];

    typeList.forEach((item, index)=>{
        let balancePromise = new Promise(resolve => {resolve(0)});
        let decimalsPromise = new Promise(resolve => {resolve(0)});
        let ownerPromise = new Promise(resolve => {resolve(0)});
        let controllerPromise = new Promise(resolve => {resolve(0)});
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
                controllerPromise = StandardAsset.at(item.address).then(instance => {
                    return instance.controller.call({from: owner});
                }).catch(err => {});
            }

        }
        allBalancesPromise.push(balancePromise);
        allDecimalsPromise.push(decimalsPromise);
        allOwnerPromise.push(ownerPromise);
        allControllerPromise.push(controllerPromise);
    });
    let allBalances = await Promise.all(allBalancesPromise).catch(err => {ctx.throw(err)});
    let allDecimals = await Promise.all(allDecimalsPromise).catch(err => {ctx.throw(err)});
    let allOwner = await Promise.all(allOwnerPromise).catch(err => {ctx.throw(err)});
    let allController = await Promise.all(allControllerPromise).catch(err => {ctx.throw(err)});
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
        if(temp.type == "UPA"){

            if(allOwner[index])
                temp.isOwner = allOwner[index].toLowerCase() == owner.toLowerCase();
            if(allController[index])
                temp.mintable = allController[index].toLowerCase() == ethereumCfg.address.toLowerCase();
        }
        let metadata = temp.metadata;
        if(metadata && udapValidator.isValidJson(metadata)){
            delete temp.metadata; //Do not return metadata
            metadata = JSON.parse(metadata);
            if(metadata.supplyLimit)
                temp.supplyLimit = metadata.supplyLimit;
            /*if(metadata.schema)
                temp.schema = metadata.schema;*/
           /* if(metadata.views)
                temp.views = metadata.views;*/
            if(metadata.icon)
                temp.icon = metadata.icon;
        }
        content.push(temp);
    });
    //response
    ctx.response.body = Result.success(content);
};

const cloneType = async (ctx) =>{
    let fields = ctx.request.body;
    if (!fields) ctx.throw("Please fill in the data");
    let name = fields.name;
    let symbol = fields.symbol;
    let supplyLimit = fields.supplyLimit;
    let icon = fields.icon;
    let caller = ctx.header["x-identity"];
    let appid = fields.appid;
    let viewTemplateId = fields.viewTemplateId;
    if(!supplyLimit)
        supplyLimit = 0;

    //valid data
    if (!name || !validator.isLength(name,{min:1, max: 45}))
        ctx.throw("'name' param cannot be empty and the max length is 45");
    if (!symbol || !validator.isLength(symbol,{min:1, max: 45}))
        ctx.throw("'symbol' param cannot be empty and the max length is 45");
    if (!caller || !web3.isAddress(caller))
        ctx.throw("'owner' param isn't an address");
    if (!icon || !validator.isURL(icon))
        ctx.throw("'icon' param error");
    await udapValidator.appidRegistered(appid);
    /*let typeCount = await AssetType.count({
        where: {
            gid:appid,
            name:name,
            symbol:symbol
        }
    }).catch((err) => {
        ctx.throw(err);
    });
    if (typeCount > 0)
        ctx.throw("AssetType already exists");*/
    let typeId = ctx.params.id;

    let asType = await AssetType.findById(parseInt(typeId),{raw:true}).catch(err => {
        ctx.throw(err);
    });
    if(asType == null)
        ctx.throw("AssetType id error");

    let metadata = {
        name:name,
        symbol:symbol,
        // desc:desc?desc:"",
        icon:icon,
        // schema:schemaSrc,
        // views:views?views:[]
    };
    if(udapValidator.isValidJson(asType.metadata))
        metadata.schema = JSON.parse(asType.metadata).schema;
    if(!metadata.schema || !udapValidator.isValidJson(metadata.schema))
        ctx.throw("schema  error");

    let metadataUri = await ipfsUtil.addJson(metadata).catch((err) => {
        ctx.throw(err);
    });
    let txHash = await ethereumUtil.newStandAssert(name,symbol,supplyLimit,metadataUri,caller).catch((err) => {
        ctx.throw(err);
    });

    let type = {
        gid:appid,
        metadata:JSON.stringify(metadata),
        name:name,
        symbol:symbol,
        txHash:txHash,
        status:2,
        type:"UPA"
    };
    let result = await AssetType.create(type).catch((err) => {
        ctx.throw(err);
    });
    let template = await ViewTemplate.findById(parseInt(viewTemplateId),{raw:true}).catch((err) => {
        ctx.throw(err);
    });
    if(template == null)
        ctx.throw("Cannot find viewTemplate");
    template.typeId = result.id;
    delete template.id;
    await ViewTemplate.create(template).catch(err => {ctx.throw(err)});

    ctx.response.body = Result.success(result.id);

};

const getDefaultUPA =async (ctx) => {

    let fields = ctx.query;


    if (!fields)
        ctx.throw("Param error");

    let appid = fields.appid;

    await udapValidator.appidRegistered(appid);
    //query data
    let typeList = await AssetType.findAll(
        {
            where: {gid: '0',type:"UPA"},
            order: [['id', 'ASC']],
            attributes: ['id','metadata','name','symbol'],
            raw:true
        }
    ).catch(function (err) {
        ctx.throw(err.message);
    });

    const newTypeList = typeList.map((item)=>{
        let metadata = item.metadata;
        delete item.metadata;
        if(metadata && udapValidator.isValidJson(metadata)){
            metadata = JSON.parse(metadata);
            if(metadata.icon)
                item.icon = metadata.icon;
        }
        return item;
    });
    //response
    ctx.response.body = Result.success(newTypeList);
};

const getTemplatesByTypeId =async (ctx)=>{
    let fields = ctx.query;

    if (!fields)
        ctx.throw("Param error");

    let caller = ctx.header["x-identity"];
    let appid = fields.appid;
    await udapValidator.appidRegistered(appid);

    let typeId = ctx.params.id;
    if (!typeId)
        ctx.throw(" 'typeId' Param error");
    if(!caller || !web3.isAddress(caller))
        ctx.throw(" 'caller' header error");

    let assetType = await AssetType.findById(parseInt(typeId)).catch( err => {ctx.throw(err)});
    let owner = await StandardAsset.at(assetType.address).then(instance=>{
        return instance.owner.call({from: caller});
    }).catch( err => {ctx.throw(err)});
    if(assetType.gid != '0' && owner.toLowerCase() != caller.toLowerCase())
        ctx.throw(" 'Caller' does not have permission");

    //query data
    let templates = await ViewTemplate.findAll(
        {
            where: {key: 'view',typeId:parseInt(typeId)},
            order: [['id', 'ASC']],
            raw:true
        }
    ).catch( err => {ctx.throw(err)});

    //response
    ctx.response.body = Result.success(templates);
}

const getSchemaByTypeId =async (ctx)=>{
    let fields = ctx.query;

    if (!fields)
        ctx.throw("Param error");

    let caller = ctx.header["x-identity"];
    let appid = fields.appid;
    await udapValidator.appidRegistered(appid);

    let typeId = ctx.params.id;
    if (!typeId)
        ctx.throw(" 'typeId' Param error");
    if(!caller || !web3.isAddress(caller))
        ctx.throw(" 'caller' header error");

    let assetType = await AssetType.findById(parseInt(typeId)).catch( err => {ctx.throw(err)});
    let owner = await StandardAsset.at(assetType.address).then(instance=>{
        return instance.owner.call({from: caller});
    }).catch( err => {ctx.throw(err)});
    if(assetType.gid != '0' && owner.toLowerCase() != caller.toLowerCase())
        ctx.throw(" 'Caller' does not have permission");

    let metadata = assetType.metadata;
    let schema = "";
    if(metadata && udapValidator.isValidJson(metadata)){
        metadata = JSON.parse(metadata);
        schema = JSON.stringify(metadata.schema);
    }

    //response
    ctx.response.body = Result.success(schema);
}

module.exports  = { create:create,getAll:getAll,getTemplatesByTypeId:getTemplatesByTypeId,cloneType:cloneType,getSchemaByTypeId:getSchemaByTypeId};
