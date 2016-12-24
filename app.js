const koa = require('koa')
const json = require('koa-json')
const xml = require('koa-xml')
let feed = require('./includes/feed')
let route = require('koa-route') //require it
let request = require('koa-request')
let paramify = require('koa-params')
let cors = require('koa-cors')
let parseXML = require('xml2js').parseString;



route = paramify(route);
let param = route.param;
let get = route.get;

let app = koa();
let appPort = (process.env.PORT || 3000)
app.use(cors());

// PARAMETERS
param('time', function*(timeParam, next) {
  let options = {
    url: `http://webservices.nextbus.com/service/publicXMLFeed?command=vehicleLocations&a=ttc&r=60&t=${timeParam}`
  };
  this.xmlResponse = yield request(options)
  yield next;
})

// ROUTES

app.use(function *(next){
  yield next;
});

app.use(route.get('/', function *() {
  this.body = {
    message: 'System is working'
  }
}));

app.use(route.get('/test', function *() {
  let options = {
    url: 'http://webservices.nextbus.com/service/publicXMLFeed?command=vehicleLocations&a=ttc&r=60&t=1482604075265'
  }
  let xmlResponse = yield request(options)
  console.log(xmlResponse)

  this.body = xmlResponse.body
}));

app.use(route.get('/otherDefaultQueries/:time', function *() {
  this.body = {
    results: this.xmlResponse.body
  };
}));

// response

app.use(json());
const xmlOptions = {
  normalize: true,
  firstCharLowerCase: true,
  explicitArray: false,
  ignoreAttrs: true
}
app.use(xml(xmlOptions))

app.listen(appPort);
console.log('--- Listening at post ' + appPort);