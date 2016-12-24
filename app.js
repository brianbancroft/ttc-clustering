let koa = require('koa');
let json = require('koa-json');
let feed = require('./includes/feed');
let route = require('koa-route'); //require it
let paramify = require('koa-params');
let cors = require('koa-cors');


route = paramify(route);
let param = route.param;
let get = route.get;

let app = koa();
let appPort = (process.env.PORT || 3000)
app.use(cors());

// PARAMETERS
param('time', function*(timeParam, next) {
  this.paramString = timeParam;
  yield next;
})

// ROUTES

app.use(function *(next){
  yield next;
});

app.use(route.get('/', function*() {
  this.body = {
    message: 'System is working'
  }
}));

app.use(route.get('/defaultQuery/:time', function*() {
  this.body = {
    results: this.paramString
  };
}));

// response

app.user(json());

app.listen(appPort);
console.log('--- Listening at post ' + appPort);