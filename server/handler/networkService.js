const networkCfg = require('../config/network-config');

const Result = require('../common/result');

const getAll = async (ctx) => {
    let content = [];
    for (let net in networkCfg) {
        let eachNet = networkCfg[net];
        eachNet.networkId = net;
        content.push(eachNet);
    }
    ctx.response.body = Result.success(content);
};

const getById = async (ctx,next) => {
    let netParam = ctx.params.id;

    let content = {};
    let network = networkCfg[netParam];
    if(network){
        network.networkId = netParam;
        content = network;
    }

    ctx.response.body = Result.success(content);
    next();
};


module.exports  = { getAll:getAll,getById:getById};

