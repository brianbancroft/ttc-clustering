var koa = require('koa');
var feed = require('./includes/feed');
var route = require('koa-route'); //require it
var paramify = require('koa-params');
var cors = require('koa-cors');


route = paramify(route);
let param = route.param;
let get = route.get;

let app = koa();

let appPort = (process.env.PORT || 3000)



app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

// response

app.use(function *(){
  this.body = 'test test';
});

app.listen(3000);