import getWeb3 from './utils/getWeb3';
import assetRegistry_artifacts from '../../build/contracts/AssetRegistry.json'


var accounts;
var account;
var assetRegistryAddress = assetRegistry_artifacts.networks.address;

getWeb3.then(results => {
    window.addEventListener('load', function() {
        getWeb3.then(results => {
            window.web3 = results.web3;
            web3.eth.getAccounts(function (err, accs) {
                if (err != null) {
                    alert('There was an error fetching your accounts.')
                    return
                }

                if (accs.length == 0) {
                    alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
                    return
                }
                accounts = accs;
                account = accounts[0];
                document.getElementById('accountNum').innerText = account;
            });
        });
    });
});

export {accounts,account,assetRegistryAddress};




