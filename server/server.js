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
const relayService = require('./handler/relayService');
const feesService = require('./handler/feesService');
const networkService = require('./handler/networkService');
const viewTemplateService = require('./handler/viewTemplateService');
const uploadService = require('./handler/uploadService');

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
// app.use(staticHandler(path.join(__dirname,"view")));

app.use(mount('/img', staticHandler(path.join(__dirname,"img"))));

//root path
route.get('/', main);
route.post('/apps',koaBody(),appService.register);
route.post('/types',koaBody({ multipart: true}),assetTypeService.create);
route.post('/types/:id',koaBody(),assetTypeService.cloneType);
route.get('/types',koaBody(),assetTypeService.getAll);
route.get('/types/:id/viewTemplates',assetTypeService.getTemplatesByTypeId);
route.get('/types/:id/schema',assetTypeService.getSchemaByTypeId);

route.post('/metadata',koaBody(),assetService.createMetadata);
route.post('/assets',koaBody({ multipart: true}),assetService.mint);
route.get('/assets',koaBody(),assetService.getAllByOwner);
route.get('/relay/nonce',koaBody(),relayService.getNonce);
route.get('/fees',koaBody(),feesService.queryFees);
route.get('/schemas',koaBody(),viewTemplateService.getUiAndTypeSchema);
route.post('/views',koaBody(),viewTemplateService.viewTemplate);
route.get('/networks',networkService.getAll);
route.get('/networks/:id',networkService.getById);
route.post('/image',koaBody({ multipart: true}),uploadService.uploadImage);


const testDataService = require('./handler/testDataService');
route.get('/testData',koaBody(),testDataService.getData);





app.use(route.routes())
    .use(route.allowedMethods());

const logger = (ctx, next) => {
    console.log(`${Date.now()} ${ctx.request.method} ${ctx.request.url}`);
    next();
};
app.use(logger);

assetTypeJob.startJobs();

app.listen(3000);
console.log('app started at port 3000...');
