import assetRegistry_artifacts from '../../../build/contracts/AssetRegistry.json'
import tokenConfig from "../data/token";
import {Toast} from "antd-mobile/lib/index";
import { default as contract } from 'truffle-contract'

let AssetRegistry = contract(assetRegistry_artifacts);
AssetRegistry.setProvider(web3.currentProvider);

let assetRegistryInstance;
let getAssertAddr = AssetRegistry.deployed().then(function (instance) {
    assetRegistryInstance = instance;
    return instance.getId.call(tokenConfig.tokenName,tokenConfig.tokenSymbol,tokenConfig.tokenUri,{from: account});
}).then(id => {
    return assetRegistryInstance.idAssets.call(id,{from: account});
}).then(assetAddr => {
    if (assetAddr == 0x0){
        Toast.info('The contract has not yet been created !!', 10);
        throw 'The contract has not yet been created !!';
    }
    return assetAddr;
}).catch(error => console.log(error));

export default getAssertAddr;