
const ipfsUtil = require('../util/ipfsUtil');
const Result = require('../common/result');
const fs = require('fs');
const validator = require('validator');

let mbSize = 1024 * 1024;
let MAX_SIZE = 20 * mbSize;

const uploadImage = async (ctx) => {
    let fields = ctx.request.body.fields;
    let files = ctx.request.body.files;
    if (!fields) ctx.throw("no appid ");
    if (!files) ctx.throw("no files ");

    // valid data
    let appid = fields.appid;
    let image = files.image;
    await udapValidator.appidRegistered(appid);
    if (!image)
        ctx.throw("'image' param error");
    if(Array.isArray(image))
        ctx.throw("Can only upload one file");
    let stats = fs.statSync(image.path);
    let fileSizeInBytes = stats["size"];
    if(fileSizeInBytes > MAX_SIZE )
        ctx.throw("image max size 20M ");

    //upload file to ipfs
    let buff = fs.readFileSync(image.path);

    let imageUri = await ipfsUtil.addFile(buff).catch((err) => {
        ctx.throw(err);
    });

    ctx.response.body = Result.success(imageUri);
};



module.exports  = { uploadImage:uploadImage};

