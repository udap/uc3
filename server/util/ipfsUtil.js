const ipfsAPI = require('ipfs-api');
const ipfsCfg = require("../config/ipfsCfg");
let ipfs = ipfsAPI(ipfsCfg.host,ipfsCfg.port,{protocol:ipfsCfg.protocol});
const request = require('superagent');
const validator = require('validator');

const addFile = buffer =>{
    return new Promise((resolve,reject)=>{
        try {
            ipfs.add(buffer, function (err, files) {
                if (err || typeof files == "undefined") {
                    reject(err);
                } else {
                    resolve(ipfsCfg.fileUrl+files[0].hash);
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

const getJson = async (uri) =>{
    let result = {};
    if (uri.startsWith("http:") || uri.startsWith("https:")){
        let res = await request.get(uri.replace("https://ipfs.io","http://127.0.0.1:8080")).catch( err => {
            throw err;
        });
        if(res && res.body){
            result = res.body;
            if (validator.isJSON(res.body))
                result = JSON.parse(res.body);
        }
    }
    return result;
};

/*const upload = async (ctx) => {
    ipfs.dag.put(metadata, { format: 'dag-cbor', hashAlg: 'sha2-256' });
    let uri =ipfsConfig.dataUrl+cid.toBaseEncodedString();


};*/


module.exports  = { addFile:addFile,getFile:getFile,addJson:addJson,getJson:getJson};