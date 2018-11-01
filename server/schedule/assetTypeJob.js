const ethereumCfg = require('../config/ethereumCfg');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(ethereumCfg.provider));
const AssetType = require('../model/assetType');
const TxSent = require('../model/txSent');
const txStatus = require('../common/txStatus');
const txBizType = require('../common/txBizType');
const DomainModel = require('../model/domain');

const queryCreateTypeReceipt = ()=>{
    setInterval(()=>{
        console.log("start queryCreateTypeReceipt job..");
        AssetType.findAll(
            { where: {status:2} }
        ).then(typeList =>{
            typeList.forEach((item, index)=>{
                let receipt = web3.eth.getTransactionReceipt(item.txHash);
                console.log("receipt=======,",receipt);
                let updateFields = {};
                if(receipt && receipt.contractAddress)
                    updateFields.address = receipt.contractAddress;
                if(receipt && receipt.status)
                    updateFields.status = parseInt(receipt.status,16);
                if(receipt && receipt.blockNumber)
                    updateFields.status = 1;
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
    },1 * 60 * 1000);
};

const queryTxSentReceipt = ()=>{
    setInterval(()=>{
        console.log("start TxSent job..");
        TxSent.findAll(
            { where: {status:txStatus.PENDING} }
        ).then(txList =>{
            txList.forEach((item, index)=>{
                let receipt = web3.eth.getTransactionReceipt(item.txHash);
                let updateFields = {};
                if(receipt && updateFields.status){
                    updateFields.status = parseInt(receipt.status);
                    updateFields.gasUsed = receipt.gasUsed;
                    updateFields.txCost = receipt.gasUsed * Number(item.gasPrice) + Number(item.value);
                    TxSent.update(
                        updateFields,
                        { where: { id: item.id }}
                    );
                    if(item.bizType == txBizType.SUBDOMAIN_REGISTER){
                        DomainModel.update(
                            {status:updateFields.status},
                            { where: { txHash: item.txHash }}
                        );
                    }
                }
            });
        }).catch((err) => {
            console.log(err);
        });
        console.log("end TxSent job..");
    },3 * 60 * 1000);
};
const startJobs = ()=>{
    queryCreateTypeReceipt();
    queryTxSentReceipt();

};




module.exports  = { startJobs:startJobs};
