

const testData = require('../testData');

const Result = require('../common/result');


const getData = async (ctx) =>  {
    let fields = ctx.query;


    if (!fields){
        //response
        ctx.response.body = Result.success({});
        return;
    }
    ctx.response.body = testData[fields.key];
};


module.exports  = { getData:getData};
