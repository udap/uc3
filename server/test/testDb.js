const ViewTemplate = require('../model/viewTemplate');

const fs = require('fs');
const getData =async () => {
    let template = await ViewTemplate.findAll(
        { where: {key:"VIEW",typeId:1} ,raw : true}
    ).catch(err =>{ctx.throw(err)});
    return template;

};
/*getData().then(
    result => {
        console.log(result.length)
    }

);*/


let buff = fs.readFileSync("C:\\Users\\Administrator\\Desktop\\certificate.json", "utf8");
console.log(buff);