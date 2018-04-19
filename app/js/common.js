import getWeb3 from './getWeb3';
import assetRegistry_artifacts from '../../build/contracts/AssetRegistry.json'


var accounts;
var account;

getWeb3.then(results => {
    results.web3.eth.getAccounts(function (err, accs) {
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

export {accounts,account};




