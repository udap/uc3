const ethUtil = require('ethereumjs-util');
const web3Util = require('web3-utils');

const verifySha3Sig = (from,param,sig) =>{
    let vrs = ethUtil.fromRpcSig(sig);
    let pubKey = ethUtil.ecrecover(
        ethUtil.toBuffer(ethUtil.sha3(data)),
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
