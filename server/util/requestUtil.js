const request = require('superagent');

const getText = async (uri) =>{
    let result = "";
    if (uri.startsWith("http:") || uri.startsWith("https:")){
        let res = await request.get(uri.replace("https://ipfs.io","http://127.0.0.1:8080")).catch( err => {
            throw err;
        });
        if(res && res.text){
            result = res.text;

        }
    }
    return result;
};



module.exports  = { getText:getText};