const Koa = require('koa');
const path = require('path');
const route = require('koa-router')();
const koaBody = require('koa-body');
const staticHandler = require('koa-static');
const mount = require('koa-mount');


const app = new Koa();

//error handler
const errorHandler = async (ctx, next) => {
    try {
        ctx.error = (err) => {
            ctx.throw( 'Internal Server Error');
        };
        await next();
    } catch (err) {
        ctx.response.status = 200;
        ctx.response.body = {
            code: 0,
            message: err.message
        };
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

app.use(route.routes())
    .use(route.allowedMethods());

const logger = (ctx, next) => {
    console.log(`${Date.now()} ${ctx.request.method} ${ctx.request.url}`);
    next();
};
app.use(logger);


app.listen(3000);
console.log('app started at port 3000...');
