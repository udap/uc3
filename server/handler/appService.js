const validator = require('validator');
const AppRegistry = require('../model/appRegistry');
const Result = require('../common/result');

const AssetType = require('../model/assetType');
const upxToken = require('../config/upx-config');


const register =async (ctx) => {

    let body = ctx.request.body;

    if (!body) ctx.throw("Please fill in the data");
    let id = body.id;
    let desc = body.desc;

    if (!id || !validator.isLength(id,{min:1, max: 64}))
        ctx.throw("id cannot be empty and the max length is 64");
    if (desc && !validator.isLength(id,{max: 128}))
        ctx.throw("desc max length is 128");


    let count = await AppRegistry.count({
        where: {
            gid:id
        }
    }).catch((err) => {
        ctx.throw(err.message);
    });
    if (count > 0){
        ctx.response.body = Result.other(2,"app already exists");
        return;
    }

    //save app
    let app = {
        gid: id
    };
    if (desc)
        app.desc = desc;
    await AppRegistry.create(app).catch((err) => {
        ctx.throw(err.message);
    });
    let type = {
        gid:id,
        address:upxToken.address,
        name:upxToken.name,
        symbol:upxToken.symbol,
        status:1,
        type:"ERC20"
    };
    await AssetType.create(type).catch((err) => {
        ctx.throw(err);
    });

    ctx.response.body = Result.success();
};

module.exports  = { register:register};