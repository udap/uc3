const ipfsUtil = require('../util/ipfsUtil');

const fs = require('fs');
let buff = fs.readFileSync("C:\\Users\\Administrator\\Desktop\\testImg.jpg");
ipfsUtil.addFile(buff).then(iconUri=>{
    console.log(iconUri);
}).catch(err => {
    console.log(err);
});

//The same json gets the same URL
// https://ipfs.io/api/v0/dag/get?arg=zdpuAsWVa6UniKm7Qc1UK74q44REinJLVjKX6p6zd9xvuL3pa
let json = {a:2,b:3};
ipfsUtil.addJson(json).then(iconUri=>{
    console.log(iconUri);
}).catch(err => {
    console.log(err);
});

ipfsUtil.addJson(json).then(iconUri=>{
    console.log(iconUri);
}).catch(err => {
    console.log(err);
});