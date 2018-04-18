// Import libraries
import { default as Web3} from 'web3'
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import assetRegistry_artifacts from '../../build/contracts/AssetRegistry.json'

import {Warrant,Product} from './warrant.js';

import {accounts,account,assetRegistryAddress} from './common'
import getWeb3 from "./getWeb3";


// MetaCoin is our usable abstraction, which we'll use through the code below.
var AssetRegistry = contract(assetRegistry_artifacts);


// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.


window.Show = {

    listWarrant: function () {

     getWeb3.then(results => {
         AssetRegistry.setProvider(results.web3.currentProvider);
     });
    let container = document.getElementById("container");

    `<div class='element'>
            <div class='element-title'>
            <div class='element-title-f'>Warrant Code <a href='home-detail.html'>#W1803151</a></div>
        <div class='element-title-r'>status&nbsp;:&nbsp;<span>pledge</span></div>
        </div>
        <div class='element-ul'>
            <div class='element-li'>
            <div class='one'>Product</div>
            <div class='two'>cone</div>
            </div>
            <div class='element-li'>
            <div class='one'>Total</div>
            <div class='two'>144Kg</div>
        </div>
        </div>
     </div>`
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
            return assetRegistry.getOwnAssets.call(account, {from: account});
        }).then(function (result) {
            console.log(result);
        }).catch(function (e) {
            console.log(e)
        })
    }
}

window.addEventListener('load', function () {
    Show.listWarrant();
})
