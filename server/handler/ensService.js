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
const harvestRegistrarAddr = harvestRegistrar_artifacts.networks[web3.version.network];
const namehash = require('eth-ens-namehash');

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
const registerSubDomain = async (ctx) => {

    let fields = ctx.request.body;
    if (!fields) ctx.throw("no param ");
    let caller = ctx.header["x-identity"];
    let domain = fields.domain;
    let sig = fields.sig;

    // valid param
    if (!web3.isAddress(caller))
        ctx.throw("'caller' param error");
    if (!udapValidator.isDomainName(domain))
        ctx.throw("'domain' param error");
    if (!sig)
        ctx.throw("'sig' param error");

    let nonce = await HarvestRegistrar.deployed().then(instance=>{
        return instance.nonces(caller);
    });
    let sha = web3Util.soliditySha3(
        {type: 'address', value: harvestRegistrarAddr},
        {type: 'uint256', value: nonce.toNumber()},
        {type: 'string', value: domain},
        {type: 'address', value: caller});
    if(!signUtil.verifyEcsign(Buffer.from(sha.substr(2), 'hex'),sig,caller))
        ctx.throw("Signature error");

    // valid data
    let address = fields.address;
    if (!web3.isAddress(address))
        ctx.throw("'address' param error");
    await udapValidator.appidRegistered(fields.appid);

    let txHash = await ethereumUtil.registerSubdomain(caller,domain,caller,sig);
    ctx.response.body = Result.success(txHash);
};



module.exports  = {
    getAddrByDomain:getAddrByDomain,
    getDomainByAddr:getDomainByAddr,
    registerSubDomain:registerSubDomain
};
