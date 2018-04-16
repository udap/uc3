// Import libraries
import { default as Web3} from 'web3'
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import assetRegistry_artifacts from '../../build/contracts/AssetRegistry.json'

import {Warrant,Product} from './warrant.js'

// MetaCoin is our usable abstraction, which we'll use through the code below.
var AssetRegistry = contract(assetRegistry_artifacts)


// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts
var account
var assetRegistryAddress

window.Issue = {
  start: function () {
    var self = this

    AssetRegistry.setProvider(web3.currentProvider)

    web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        alert('There was an error fetching your accounts.')
        return
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
        return
      }
      accounts = accs
      account = accounts[0]
      document.getElementById('accountNum').innerText = account
    })
  },
  getData: function () {
      let skus = document.getElementsByName("sku");
      let origins = document.getElementsByName("origin");
      let specNames = document.getElementsByName("spacName");
      let numberOfPieceses = document.getElementsByName("numberOfPieces");
      let weights = document.getElementsByName("weight");
      let units = document.getElementsByName("unit");

      let products = [];
      for(let i = 0; i< skus.length-1 ; i++){
          let product  = new Product(skus[i].value,origins[i].value,specNames[i].value,numberOfPieceses[i].value,weights[i].value,units[i].value);
          products.push(product);
      }

      let productName = document.getElementById("productName").value;
      let totalWeight = document.getElementById("totalWeight").value;
      let storageRoomCode = document.getElementById("storageRoomCode").value;
      let warehouseAddress = document.getElementById("warehouseAddress").value;

      let amount = 0;
      for(let i = 0; i< weights.length - 1 ; i++){
          let weight = weights[i].value;
          let unit = units[i].value;
          let numberOfPieces = numberOfPieceses[i].value;
          if(unit == "KG")
              amount = amount + weight*numberOfPieces*2;
          else if (unit == "TON")
              amount = amount + weight*numberOfPieces*2000;
          else
              amount = amount+ weight*numberOfPieces;
      }
      totalWeight = amount+"JIN";
      if(amount > 2000){
          totalWeight = amount / 2000.0 +"TON";
      }



      let warrant = new Warrant(productName,totalWeight,storageRoomCode,warehouseAddress,products);
      console.log(warrant);
      return warrant;
  },
  issue: function () {
    var self = this

      let owner = document.getElementById("owner");
      let supervise = document.getElementById("supervise");
      
      let warrant = this.getData();



    /*this.setStatus('Initiating transaction... (please wait)')

      var meta
      MetaCoin.deployed().then(function (instance) {
          meta = instance
          return meta.sendCoin(receiver, amount, {from: account})
      }).then(function () {
          self.setStatus('Transaction complete!')
          self.refreshBalance()
      }).catch(function (e) {
          console.log(e)
          self.setStatus('Error sending coin; see log.')
      })*/
  }
}

window.addEventListener('load', function () {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.info('Using web3 detected from external source) http://truffleframework.com/tutorials/truffle-and-metamask')
        // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider)
  } else {
    console.info('No web3 detected. Falling back to http://127.0.0.1:9545')
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))
  }

  Issue.start();
})
