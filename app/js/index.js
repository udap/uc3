// Import libraries
import { default as Web3} from 'web3'
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import assetRegistry_artifacts from '../../build/contracts/AssetRegistry.json'

import {Warrant,Product} from './warrant.js';

import {accounts,account,assetRegistryAddress} from './common'


// MetaCoin is our usable abstraction, which we'll use through the code below.
var AssetRegistry = contract(assetRegistry_artifacts);


// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.


window.Show = {
    listWarrant: function () {
        var self = this
        let warrant = this.getData();

        let promise = "";
        if(assetRegistryAddress){
            promise = AssetRegistry.at(assetRegistryAddress);
        }else{
            promise = AssetRegistry.deployed();
        }
        let assetRegistry;

        promise.then(function (instance) {
            assetRegistryAddress = instance.address;
            assetRegistry = instance;
            return assetRegistry.createAsset("",true,false,JSON.stringify(warrant),"",{from:account});
        }).then(function (result) {
            window.location.href="index.html";
        }).catch(function (e) {
            console.log(e)
        })
    }
}

window.addEventListener('load', function () {
    Issue.start();
})
