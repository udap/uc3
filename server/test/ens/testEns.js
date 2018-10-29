const ensutils = require('./ensutils-testnet');
const ethereumCfg = require('../../config/ethereumCfg');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(ethereumCfg.provider));
const Tx = require('ethereumjs-tx');
const privateKey = Buffer.from(ethereumCfg.privateKey, 'hex');

let domain = "udap88812";
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
    rawTx.gasLimit=web3.toHex(gasEstimate);
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
// setResolver();

let setDomainAddr = () =>{
    let data = ensutils.publicResolver.setAddr.getData(ensutils.namehash(fullDomain),"0xcD86431E62Bca1F4Fbef76669D3FB22B90fc83b8");
    let to = ensutils.publicResolver.address;
    let value = "0x00";
    createTx(to,data,value);
};

// setDomainAddr()



//1、
// createTestDomain();
//2、
// setResolver();
//3、
// setDomainAddr();



//Set the caller's domain to 'fullDomain'
let setDomainReverse = () =>{
    let data = ensutils.reverseRegistrar.setName.getData(fullDomain);
    let to = ensutils.reverseRegistrar.address;
    let value = "0x00";
    createTx(to,data,value);
};

//4、
// setDomainReverse();
/*

let fullDomainAddr= ensutils.getAddr(fullDomain);
console.log(""+fullDomain+" addr == ",fullDomainAddr);

// 0x53350F4089B10E516c164497f395Dbbbc8675e20 - defaultResolver from reverseResolver
let reverseResolverAddr = ensutils.ens.resolver.call(ensutils.namehash(fullDomainAddr.substr(2)+'.addr.reverse'));


console.log("reverseResolverAddr == ",reverseResolverAddr);

const reverseResolver = ensutils.resolverContract.at(reverseResolverAddr);
let  getDomain  = reverseResolver.name(ensutils.namehash(fullDomainAddr.substr(2) + '.addr.reverse')).call();

console.log("getDomain == ",getDomain);
*/

/*await ensutils.publicResolver.name(namehash(yourAccount.substr(2) + '.addr.reverse')).call()
// nikola.test

console.log(""+fullDomainAddr+" domain == ",ensutils.reverseRegistrar.name.call(fullDomainAddr));*/





