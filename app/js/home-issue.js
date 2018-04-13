// Import libraries
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import assetRegistry_artifacts from '../../build/contracts/AssetRegistry.json'

// MetaCoin is our usable abstraction, which we'll use through the code below.
var AssetRegistry = contract(assetRegistry_artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;
var assetRegistryAddress;

window.Issue = {
    start: function() {
        var self = this;

        AssetRegistry.setProvider(web3.currentProvider);

        web3.eth.getAccounts(function(err, accs) {
            if (err != null) {
                alert("There was an error fetching your accounts.");
                return;
            }

            if (accs.length == 0) {
                alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
                return;
            }
            accounts = accs;
            account = accounts[0];
            document.getElementById("accountNum").innerText =account;
        });
    },
    getData:function(){


    },
    issue: function() {
        var self = this;

        var amount = parseInt(document.getElementById("amount").value);
        var receiver = document.getElementById("receiver").value;

        this.setStatus("Initiating transaction... (please wait)");

        var meta;
        MetaCoin.deployed().then(function(instance) {
            meta = instance;
            return meta.sendCoin(receiver, amount, {from: account});
        }).then(function() {
            self.setStatus("Transaction complete!");
            self.refreshBalance();
        }).catch(function(e) {
            console.log(e);
            self.setStatus("Error sending coin; see log.");
        });
    }
};

window.addEventListener('load', function() {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
        console.info("Using web3 detected from external source) http://truffleframework.com/tutorials/truffle-and-metamask")
        // Use Mist/MetaMask's provider
        window.web3 = new Web3(web3.currentProvider);
    } else {
        console.info("No web3 detected. Falling back to http://127.0.0.1:9545");
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
    }

    Issue.start();
});
