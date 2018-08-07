const ipfsAPI = require('ipfs-api');
const ipfsCfg = require("../config/ipfsCfg");
let ipfs = ipfsAPI(ipfsConfig.host,ipfsConfig.port,{protocol:ipfsConfig.protocol});
const request = require('superagent');

const addFile = (buffer) =>{
    return new Promise((resolve,reject)=>{
        try {
            ipfs.add(buffer, function (err, files) {
                if (err || typeof files == "undefined") {
                    reject(err);
                } else {
                    resolve(files[0].hash);
                }
            })
        }catch(ex) {
            reject(ex);
        }
    })
};
const getFile = (hash) =>{
    return new Promise((resolve,reject)=>{
        try{
            ipfs.get(hash,function (err,files) {
                if (err || typeof files == "undefined") {
                    reject(err);
                }else{
                    resolve(files[0].content);
                }
            })
        }catch (ex){
            reject(ex);
        }
    });
};

const addJson = async (json) =>{
    let  cid = await ipfs.dag.put(json, { format: 'dag-cbor', hashAlg: 'sha2-256' });
    return ipfsCfg.dataUrl+cid.toBaseEncodedString();
};

const getJson = async (hash) =>{
    let uri =ipfsCfg.dataUrl+hash;
    let res = await request.get(uri.replace("ipfs.io","ipfs.infura.io"));
    return JSON.parse(res.body);
};

/*const upload = async (ctx) => {
    ipfs.dag.put(metadata, { format: 'dag-cbor', hashAlg: 'sha2-256' });
    let uri =ipfsConfig.dataUrl+cid.toBaseEncodedString();


};*/


module.exports  = { addFile:addFile,getFile:getFile,addJson:addJson,getJson:getJson};