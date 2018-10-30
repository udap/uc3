var HarvestRegistrar = artifacts.require("./ens/HarvestRegistrar.sol");

let ens = "0x112234455c3a32fd11230c42e7bccd4a84e02010";
let defaultResolver = "0x4c641fb9bad9b60ef180c31f56051ce826d21a9a" ;

module.exports = function(deployer,network) {
    if (network == "ropsten") {
        deployer.deploy(HarvestRegistrar,ens,defaultResolver);
    } else {
    }
};
