const ipfsUtil = require('../util/ipfsUtil');

const fs = require('fs');
/*let buff = fs.readFileSync("C:\\Users\\Administrator\\Desktop\\testImg.jpg");*/

let bufferJson = "\"{\\n\\t\\\"id\\\": \\\"This is id\\\",\\n\\t\\\"grantedTo\\\": \\\"grantedTo\\\",\\n\\t\\\"dateIssued\\\": \\\"2018-09-19\\\",\\n\\t\\\"signers\\\": [{\\n\\t\\t\\\"name\\\": \\\"This is Name\\\",\\n\\t\\t\\\"title\\\": \\\"This is Title\\\"\\n\\t}]\\n}\"";
console.log(JSON.parse(bufferJson));
bufferJson = Buffer.from(bufferJson);
/*ipfsUtil.addFile(bufferJson).then(iconUri=>{
    console.log(iconUri);
}).catch(err => {
    console.log(err);
});*/

//The same json gets the same URL
// https://ipfs.io/api/v0/dag/get?arg=zdpuAsWVa6UniKm7Qc1UK74q44REinJLVjKX6p6zd9xvuL3pa
let json = {
    name:"W1803153",
    description:"Warehouse receipt for agricultural goods",
    image:"http://47.104.225.39/img/warrant.png"
};
ipfsUtil.addJson(json).then(iconUri=>{
    console.log(iconUri);
}).catch(err => {
    console.log(err);
});