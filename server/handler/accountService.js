const validator = require('validator');
const blockies = require('ethereum-blockies-png');
const fs = require('fs');
const Result = require('../common/result');
const udapValidator = require('../common/udapValidator');


const Web3 = require('web3');
const web3 = new Web3();

const generateIcon =async (ctx) => {

    let fields = ctx.query;
    let address = ctx.params.address;


    if (!fields){
        ctx.throw("Param error");
    }
    if(!web3.isAddress(address))
        ctx.throw(" 'address' param error");
    await udapValidator.appidRegistered(fields.appid);

    let buffer = blockies.createBuffer({ // All options are optional
        seed: address.toLowerCase(), // seed used to generate icon data, default: random
        color: '#dfe', // to manually specify the icon color, default: random
        bgcolor: '#aaa', // choose a different background color, default: random
        size: 15, // width/height of the icon in blocks, default: 8
        scale: 3, // width/height of each block in pixels, default: 4
        spotcolor: '#000' // each pixel has a 13% chance of being of a third color,
        // default: random. Set to -1 to disable it. These "spots" create structures
        // that look like eyes, mouths and noses.
    });
    ctx.type="png"
    ctx.response.body = buffer;
};

module.exports  = { generateIcon:generateIcon};