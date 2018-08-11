const ethereumCfg = require('../config/ethereumCfg');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(ethereumCfg.provider));
const AssetType = require('../model/assetType');

const queryCreateTypeReceipt = ()=>{
    setInterval(()=>{
        console.log("start queryCreateTypeReceipt job..");
        AssetType.findAll(
            { where: {status:2} }
        ).then(typeList =>{
            typeList.forEach((item, index)=>{
                let receipt = web3.eth.getTransactionReceipt(item.txHash);
                let updateFields = {};
                if(receipt && receipt.contractAddress)
                    updateFields.address = receipt.contractAddress;
                if(receipt && receipt.status)
                    updateFields.status = parseInt(receipt.status,16);
                if (Object.keys(updateFields.length > 0)){
                    AssetType.update(
                        updateFields,
                        { where: { id: item.id }}
                    );
                }
            });
        }).catch((err) => {
            console.log(err);
        });
        console.log("end queryCreateTypeReceipt job..");
    },5 * 60 * 1000);
};





module.exports  = { queryCreateTypeReceipt:queryCreateTypeReceipt};
