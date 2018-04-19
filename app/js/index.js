// Import libraries

import { default as Web3} from 'web3'
import { default as contract } from 'truffle-contract';

// Import our contract artifacts and turn them into usable abstractions.
import assetRegistry_artifacts from '../../build/contracts/AssetRegistry.json';

import standardAsset_artifacts from '../../build/contracts/StandardAsset.json'


import {Warrant,Product} from './warrant.js';

import {accounts,account} from './common'
import getWeb3 from "./getWeb3";


// MetaCoin is our usable abstraction, which we'll use through the code below.
var AssetRegistry = contract(assetRegistry_artifacts);

var StandardAsset = contract(standardAsset_artifacts);


// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.


window.Show = {

    listWarrant: function () {
        let self = this;
        let container = document.getElementById("container");
        let assetRegistry;


         getWeb3.then(results => {

             AssetRegistry.setProvider(results.web3.currentProvider);
             StandardAsset.setProvider(results.web3.currentProvider);

             AssetRegistry.deployed().then(function (instance) {
                 assetRegistry = instance;
                 return assetRegistry.getOwnAssets.call({from: account});
             }).then(function (assetAddrs) {

                 assetAddrs.forEach((item, index) => {

                     StandardAsset.at(item).then( instance => {
                         return instance.getMetaData.call({from: account});
                     }).then(metaData => {
                         let data = metaData[4];
                         container.appendChild(self.oneWarrant(JSON.parse(data)));
                     });
                     console.log(index,item);

                 })

             }).catch(function (e) {
                 console.log(e)
             });
         }).catch(function (e) {
             console.log(e)
         });



    },//warehouseAddress,products
    oneWarrant : function(warrant){
        let divNode = document.createElement("div");
        divNode.classList.add("element");

       let content = `<div class='element-title'>
                            <div class='element-title-f'>Warrant Code : <a href='home-detail.html'>${warrant.warrantCode}</a></div>
                            <div class='element-title-r'>status&nbsp;:&nbsp;<span>pledge</span></div>
                        </div>
                        <div class='element-ul'>
                            <div class='element-li'>
                                <div class='one'>product</div>
                                <div class='two'>${warrant.productName}</div>
                            </div>
                            <div class='element-li'>
                                <div class='one'>Total</div>
                                <div class='two'>${warrant.totalWeight}</div>
                            </div>
                        </div>
                        <div class='element-ul'>
                            <div class='element-li'>
                                <div class='one'>Warehouse Address</div>
                                <div class='two'>${warrant.warehouseAddress}</div>
                            </div>
                            <div class='element-li'>
                                <div class='one'>StorageRoom Code</div>
                                <div class='two'>${warrant.storageRoomCode}</div>
                            </div>
                        </div>`;
        divNode.innerHTML = content;
        return divNode;
    }


}

window.addEventListener('load', function () {
    Show.listWarrant();
})
