const ethUtil = require('ethereumjs-util');
const web3Util = require('web3-utils');

const verifySha3Sig = (from,param,sig) =>{
    let sortParam = "";
    for (let key of Object.keys(param).sort()) {
        if(sortParam == "")
            sortParam = `${key}=${param[key]}`;
        else
            sortParam = `${sortParam}&${key}=${param[key]}`;
    }
    let vrs = ethUtil.fromRpcSig(sig);
    let pubKey = ethUtil.ecrecover(
        ethUtil.toBuffer(ethUtil.sha3(sortParam)),
        parseInt(vrs.v),
        ethUtil.toBuffer(vrs.r),
        ethUtil.toBuffer(vrs.s)
    );
    let publicKey = ethUtil.bufferToHex(ethUtil.pubToAddress(pubKey));
    return publicKey == from;
};
const verifySoliditySha3Sig = (param,sig) =>{
    throw "Not support soliditySha3Sig";
};

module.exports  = { verifySig:verifySha3Sig};
