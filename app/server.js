const Koa = require('koa');
const path = require('path');
const serve = require('koa-static');
const route = require('koa-route');


const app = new Koa();
const staticCtx = serve(path.join(__dirname));

const main = ctx => {
    ctx.response.redirect("app/home.html");
};

app.use(route.get('/', main));
app.use(staticCtx);
app.listen(3000);
