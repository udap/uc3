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
const verifySha3 = (hex,param) =>{
    let paramHex = ethUtil.bufferToHex(ethUtil.sha3(param));
    return paramHex == hex;
};
const verifyEcsign = (msgHash,sig,signer) =>{
    let sigVRS = ethUtil.fromRpcSig(sig);
    let pubKey = ethUtil.ecrecover(
        ethUtil.toBuffer(msgHash),
        parseInt(sigVRS.v),
        ethUtil.toBuffer(sigVRS.r),
        ethUtil.toBuffer(sigVRS.s)
    );
    pubKey = ethUtil.bufferToHex(ethUtil.pubToAddress(pubKey));
    return signer == pubKey;
};

module.exports  = { verifySha3Sig:verifySha3Sig,verifySha3:verifySha3,verifyEcsign:verifyEcsign};
