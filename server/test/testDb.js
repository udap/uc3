const ViewTemplate = require('../model/viewTemplate');

const fs = require('fs');
const getData =async () => {
    /*let template = await ViewTemplate.findAll(
        { where: {key:"VIEW",typeId:1} ,raw : true}
    ).catch(err =>{ctx.throw(err)});*/

    let template = await  ViewTemplate.findById(3).catch(err =>{ctx.throw(err)});
    return template;

};
getData().then(
    result => {
        console.log(result)
    }

);


/*
let buff = fs.readFileSync("C:\\Users\\Administrator\\Desktop\\certificate.json", "utf8");
console.log(buff);*/
