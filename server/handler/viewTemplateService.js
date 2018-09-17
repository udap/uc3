
const Result = require('../common/result');
const ViewTemplate = require('../model/viewTemplate');
const validator = require('validator');
const fs = require('fs');
const template7 = require('template7');
const udapValidator = require('../common/udapValidator');

const requestUtil = require('../util/requestUtil');

const viewTemplate = async (ctx) => {

    let fields = ctx.request.body;
    if (!fields) ctx.throw("no param ");

    // valid data
    let typeId = fields.typeId;
    let key = fields.key;
    let appid = fields.appid;
    let metadate = fields.metadate;

    await udapValidator.appidRegistered(appid);
    if (!key)
        ctx.throw("'key' param error");
    if (!typeId)
        ctx.throw("'typeId' param error");
    if (!metadate)
        ctx.throw("'metadate' param error");
    if(typeof metadate == "string")
        metadate = JSON.parse(metadate);


    let templates = await ViewTemplate.findAll(
        { where: {key:key,typeId:typeId},raw:true}
    ).catch(err =>{ctx.throw(err)});

    if (templates.length == 0)
        ctx.throw(" Can't find template");

    metadate.context = templates[0].context;
    let templeteContent = "";


    let templateUri = templates[0].context+templates[0].templateUri;
    if(templateUri.startsWith("http://") || templateUri.startsWith("https://")){
        templeteContent = await requestUtil.getText(templateUri);
    }else if(templateUri.startsWith("file:")){
        templeteContent = fs.readFileSync(templateUri.replace("file:", ""),"utf8");
    }
    let compiledTemplate = template7(templeteContent).compile();

    let html = compiledTemplate(metadate);
    ctx.response.type = 'text/html';
    ctx.response.body = html;

};



module.exports  = { viewTemplate:viewTemplate};

