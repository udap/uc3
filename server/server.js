const Koa = require('koa');
const path = require('path');
const route = require('koa-router')();
const koaBody = require('koa-body');
const staticHandler = require('koa-static');
const mount = require('koa-mount');
const appService = require('./handler/appService');
const assetTypeService = require('./handler/assetTypeService');
const assetService = require('./handler/assetService');
const Result = require('./common/result');
const assetTypeJob = require('./schedule/assetTypeJob');

const app = new Koa();

//error handler
const errorHandler = async (ctx, next) => {
    try {
        ctx.error = (err) => {
            ctx.throw( 'Internal Server Error');
        };
        await next();
    } catch (err) {
        console.log(err);
        ctx.response.status = 200;
        ctx.response.body = Result.fail(err.message,err);
    }
};

const main = ctx => {
    ctx.response.redirect("./view/index.html");
};
//error Handler
app.use(errorHandler);
//static ctx
app.use(staticHandler(path.join(__dirname,"view")));

//root path
route.get('/', main);
route.post('/apps',koaBody(),appService.register);
route.post('/types',koaBody({ multipart: true}),assetTypeService.create);
route.get('/types',koaBody(),assetTypeService.getAll);
route.post('/assets',koaBody({ multipart: true}),assetService.mint);
route.get('/assets',koaBody(),assetService.getAllByOwner);





app.use(route.routes())
    .use(route.allowedMethods());

const logger = (ctx, next) => {
    console.log(`${Date.now()} ${ctx.request.method} ${ctx.request.url}`);
    next();
};
app.use(logger);

assetTypeJob.queryCreateTypeReceipt();

app.listen(3000);
console.log('app started at port 3000...');
