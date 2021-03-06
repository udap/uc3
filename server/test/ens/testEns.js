const ensutils = require('./ensutils-testnet');
const ethereumCfg = require('../../config/ethereumCfg');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(ethereumCfg.provider));
const Tx = require('ethereumjs-tx');
const privateKey = Buffer.from(ethereumCfg.privateKey, 'hex');

let domain = "udapmax";
let fullDomain = domain+".test";
let  expiryTimes = new Date(ensutils.testRegistrar.expiryTimes(web3.sha3(domain)).toNumber() * 1000);

//If this line returns a date earlier than the current date, the name is available and you’re good to go.
// You can register the domain for yourself by running:
console.log("expiryTimes === ",expiryTimes);
console.log("web3.sha3("+domain+") === ",web3.sha3(domain));
console.log("namehash("+domain+") === ",ensutils.namehash(domain));
console.log("namehash("+fullDomain+") === ",ensutils.namehash(fullDomain));
console.log("namehash('test') === ",ensutils.namehash('test'));
console.log("namehash('eth') === ",ensutils.namehash('eth'));
console.log("namehash('addr.reverse') === ",ensutils.namehash('addr.reverse'));


//create domain name
let  createTestDomain = () => {
    let data = ensutils.testRegistrar.register.getData(web3.sha3(domain),ethereumCfg.address);
    let to = ensutils.testRegistrar.address;
    let value = "0x00";
    createTx(to,data,value);

};
let  createTx = (to,data,value) =>  {
    let gasPrice = web3.eth.gasPrice;
    let nonce = web3.eth.getTransactionCount(ethereumCfg.address);
    let rawTx = {
        from:ethereumCfg.address,
        to:to,//ensutils.testRegistrar.address,
        nonce: web3.toHex(nonce),
        gasPrice: web3.toHex(gasPrice),
        value: value,//'0x00',
        data: data
    };
//estimateGas
    let gasEstimate = web3.eth.estimateGas(rawTx);
    rawTx.gasLimit=web3.toHex(gasEstimate*2);
    let tx = new Tx(rawTx);
    tx.sign(privateKey);
    let serializedTx = tx.serialize();
    web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), (err, hash) => {
        if (!err)
            console.log("hash===",hash);
        else
            console.log("err===",err);
    });
};

let setResolver = () =>{
    let data = ensutils.ens.setResolver.getData(ensutils.namehash(fullDomain),ensutils.publicResolver.address);
    let to = ensutils.ens.address;
    let value = "0x00";
    createTx(to,data,value);
};

let setDomainAddr = () =>{
    let data = ensutils.publicResolver.setAddr.getData(ensutils.namehash(fullDomain),"0xcD86431E62Bca1F4Fbef76669D3FB22B90fc83b8");
    let to = ensutils.publicResolver.address;
    let value = "0x00";
    createTx(to,data,value);
};







//Set the caller's domain to 'fullDomain'
let setDomainReverse = () =>{
    let data = ensutils.reverseRegistrar.setName.getData(fullDomain);
    let to = ensutils.reverseRegistrar.address;
    let value = "0x00";
    createTx(to,data,value);
};




let getAddrWithDomain = () =>{
    let fullDomainAddr= ensutils.getAddr(fullDomain);
    console.log(""+fullDomain+" addr == ",fullDomainAddr);
};
let getDomainWithAddr = (address) =>{
    let addrName = address.substr(2)+".addr.reverse";
    addrName = addrName.toLowerCase();
    let node  = ensutils.namehash(addrName);
    let resolver = ensutils.ens.resolver.call(node);
    let domain = ensutils.resolverContract.at(resolver).name(node);
    console.log(addrName,"==",domain);
};

let registerSubDomain = (subdomain)=>{
    let node  = ensutils.namehash(fullDomain);
    let lable = web3.sha3(subdomain);
    console.log(subdomain,"lable node==",ensutils.namehash(subdomain+"."+fullDomain));

    // let data = ensutils.ens.setSubnodeOwner.getData(node,lable,ethereumCfg.address);
    let data = ensutils.ens.setSubnodeOwner.getData(node,lable,"0xcD86431E62Bca1F4Fbef76669D3FB22B90fc83b8");

    let to = ensutils.ens.address;
    let value = "0x00";
    createTx(to,data,value);
};

let setSubnodeToOwner = (subdomain)=>{
    let subnode = ensutils.namehash(subdomain+"."+fullDomain);
    console.log("subnode ==",subnode);

    let data = ensutils.ens.setOwner.getData(subnode,"0xcD86431E62Bca1F4Fbef76669D3FB22B90fc83b8");
    let to = ensutils.ens.address;
    let value = "0x00";
    createTx(to,data,value);
};

//1、
// createTestDomain();
//2、
// setResolver();
//3、
// setDomainAddr();
//4、
//getAddrWithDomain();

//5、Set the caller's domain to 'fullDomain'
//setDomainReverse()
// getDomainWithAddr("0x67f09ED73F2Fe18965d6f35325Ec983Aff2532e6");

//6、
// setDomainReverse();

//7、You can change the owner of a subdomain multiple times.
//set SubDomain  Owner to self
registerSubDomain("mmmer");

//8、if you are not the owner,you can't change owner with "ens.setOwner" method.
// setSubnodeToOwner("mmmer");



