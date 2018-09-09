const ViewTemplate = require('../model/viewTemplate');

const fs = require('fs');
const getData =async () => {
    /*let template = await ViewTemplate.findAll(
        { where: {key:"VIEW",typeId:1} ,raw : true}
    ).catch(err =>{ctx.throw(err)});*/

    let template = await  ViewTemplate.findById(1,{raw:true}).catch(err =>{ctx.throw(err)});
    return template;

};
/*getData().then(
    result => {
        console.log(result)
    }

);*/

let stats = fs.statSync("C:\\Users\\Administrator\\Desktop\\restclient-ui-fat-3.6.1.jar");
let fileSizeInBytes = stats["size"];
console.log(fileSizeInBytes)
/*let buff = fs.readFileSync("C:\\Users\\Administrator\\Desktop\\certificate.json");
console.log(buff);*/
