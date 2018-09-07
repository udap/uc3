const validator = require('validator');
const AppRegistry = require('../model/appRegistry');
const Result = require('../common/result');

const idGenerator = require('../util/idGenerator');

const Web3 = require('web3');
const web3 = new Web3();

const register =async (ctx) => {

    let body = ctx.request.body;

    if (!body) ctx.throw("Please fill in the data");
    let desc = body.desc;
    let name = body.name;
    let address = body.address;


    if (desc && !validator.isLength(desc,{max: 128}))
        ctx.throw("desc max length is 128");
    if (!name)
        ctx.throw(" 'name' param cannot be empty");
    if (!web3.isAddress(address))
        ctx.throw(" 'address' param error");


    let id = idGenerator.getId(address,name);
    let count = await AppRegistry.count({
        where: {
            gid:id
        }
    }).catch((err) => {
        ctx.throw(err.message);
    });
    if (count > 0){
        ctx.response.body = Result.success(id);
        return;
    }

    //save app
    let app = {
        gid: id
    };
    if (desc)
        app.desc = desc;
    await AppRegistry.create(app).catch(err => {
        ctx.throw(err.message);
    });

    ctx.response.body = Result.success(id);
};

module.exports  = { register:register};