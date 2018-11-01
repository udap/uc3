const ENS = require('ethereum-ens');
const ethereumCfg = require('../config/ethereumCfg');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(ethereumCfg.provider));
const ens = new ENS(web3);
const Result = require('../common/result');
const udapValidator = require('../common/udapValidator');
const ethereumUtil = require('../util/ethereumUtil');
const signUtil = require('../util/signUtil');
const web3Util = require('web3-utils');
const contract = require('truffle-contract');
const harvestRegistrar_artifacts = require('../../build/contracts/HarvestRegistrar.json');
const HarvestRegistrar = contract(harvestRegistrar_artifacts);
HarvestRegistrar.setProvider(web3.currentProvider);
const harvestRegistrarAddr = harvestRegistrar_artifacts.networks[web3.version.network].address;
const namehash = require('eth-ens-namehash');
const DomainModel = require('../model/domain');
const txStatus = require('../common/txStatus');
const idGenerator = require('../util/idGenerator');

const getAddrByDomain = async (ctx) => {

    let fields = ctx.query;
    if (!fields) ctx.throw("no param ");

    // valid data
    let domain = fields.domain;
    let appid = fields.appid;
    if (!udapValidator.isDomainName(domain))
        ctx.throw("'domain' param error");
    await udapValidator.appidRegistered(appid);
    let address =await ens.resolver(domain).addr().then( addr => {
        return addr;
    });
    ctx.response.body = Result.success(address);
};

const getDomainByAddr = async (ctx) => {

    let fields = ctx.query;
    if (!fields) ctx.throw("no param ");

    // valid data
    let address = fields.address;
    if (!web3.isAddress(address))
        ctx.throw("'address' param error");
    await udapValidator.appidRegistered(fields.appid);

    let domain = await ens.reverse(address).name().then( domain => {
        return domain;
    });
    ctx.response.body = Result.success(domain);
};

const existsDomain = async (ctx) => {

    let fields = ctx.query;
    if (!fields) ctx.throw("no param ");
    // let domain = fields.domain;
    let domain = ctx.params.domain;
    if (!domain) ctx.throw(" 'domain' param error ");
    await udapValidator.appidRegistered(fields.appid);

    let owner = await ens.owner(domain);
    ctx.response.body = Result.success(owner == 0);
};

const registerSubDomain = async (ctx) => {

    let fields = ctx.request.body;
    if (!fields) ctx.throw("no param ");
    let caller = ctx.header["x-identity"];
    let domain = fields.domain;
    let sig = fields.sig;
    let appid = fields.appid;

    // valid param
    if (!web3.isAddress(caller))
        ctx.throw("'caller' param error");
    if (!udapValidator.isDomainName(domain))
        ctx.throw("'subDomain' param error");
    if (!sig)
        ctx.throw("'sig' param error");
    await udapValidator.appidRegistered(appid);
    let domainArr = domain.split('.');
    if(domainArr != 3)
        ctx.throw("'subDomain' param error");
    let domainLabel = web3.sha3(domainArr[1]);
    let subDomain = domainArr[0];

    let existDomains = await DomainModel.findAll(
        {
            where: {gid:appid},
            order: [['id', 'DESC']],
            raw:true
        }
    ).catch(err => {ctx.throw(err.message);});
    if(existDomains.length > 0)
        ctx.throw("Already have a domain name");

    let nonce = await HarvestRegistrar.deployed().then(instance=>{
        return instance.nonces(caller);
    });
    let sha = web3Util.soliditySha3(
        {type: 'address', value: harvestRegistrarAddr},
        {type: 'uint256', value: nonce.toNumber()},
        {type: 'bytes32', value: domainLabel},
        {type: 'string', value: subDomain},
        {type: 'address', value: caller});
    if(!signUtil.verifyEcsign(Buffer.from(sha.substr(2), 'hex'),sig,caller))
        ctx.throw("Signature error");

    let txHash = await ethereumUtil.registerSubdomain(appid,caller,domainLabel,subDomain,sig);
    await DomainModel.create({
        gid:appid,
        name:domain,
        txHash:txHash,
        status:txStatus.PENDING
    }).catch(err => {
        throw err;
    });
    ctx.response.body = Result.success(txHash);
};

const sigParams = async (ctx) => {

    let fields = ctx.query;
    if (!fields) ctx.throw("no param ");
    await udapValidator.appidRegistered(fields.appid);
    let caller = ctx.header["x-identity"];

    if (!web3.isAddress(caller))
        ctx.throw("'caller' param error");

    let nonce = await HarvestRegistrar.deployed().then(instance=>{
        return instance.nonces(caller);
    });
    let content = {
        registrarAddr:harvestRegistrarAddr,
        nonce:nonce
    };

    ctx.response.body = Result.success(content);
};

const getDomains = async (ctx) => {

    let fields = ctx.query;
    if (!fields) ctx.throw("no param ");
    if (!fields.q) ctx.throw(" 'q' param error ");
    let appid = fields.appid;
    await udapValidator.appidRegistered(appid);
    let q = fields.q;
    let attributes = ['id','name','txHash','status'];
    if(q == "common"){
         appid = 0;
         attributes = ['name'];
    }
    let content = await DomainModel.findAll(
        {
            where: {gid:appid},
            order: [['id', 'DESC']],
            attributes: attributes,
            raw:true
        }
    ).catch(err => {ctx.throw(err.message)});
    ctx.response.body = Result.success(content);
};

const getNormalizeDomain = async (ctx) => {

    let fields = ctx.query;
    if (!fields) ctx.throw("no param ");
    // let domain = fields.domain;
    let domain = ctx.params.domain;
    if (!domain) ctx.throw(" 'domain' param error ");
    await udapValidator.appidRegistered(fields.appid);

    ctx.response.body = Result.success(namehash.normalize(domain));
};

module.exports  = {
    getAddrByDomain,
    getDomainByAddr,
    registerSubDomain,
    sigParams,
    getDomains,
    getNormalizeDomain,
    existsDomain
};
