const koa = require('koa')
const json = require('koa-json')
const xml = require('koa-xml')
let route = require('koa-route') // For calling specific routes
let request = require('koa-request')  // For RESTful requests
let paramify = require('koa-params') 
let cors = require('koa-cors')
let parser = require('xml2js').parseString;



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
  xmlResponse = yield request(options)
  let jsResponse = ''
  parser(xmlResponse.body, function(err,result){
    //Extract the value from the data element
    jsResponse = result
    if (err !== null) {
      console.log(`Error: ${err}`)
    } else {
      console.log('Success in parsing from XML to JSON')
    }
  })
  this.jsResponse = jsResponse
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

app.use(route.get('/initialDefaultRouteQuery', function *() {
  let options = {
    url: 'http://webservices.nextbus.com/service/publicXMLFeed?command=vehicleLocations&a=ttc&r=60'
  }
  let xmlResponse = yield request(options)
  let jsResponse = ''
  parser(xmlResponse.body, function(err,result){
    //Extract the value from the data element
    jsResponse = result
    if (err !== null) {
      console.log(`Error: ${err}`)
    } else {
      console.log('Success in parsing from XML to JSON')
    }
  });

  console.log(jsResponse.body.vehicle[0].$)
  jsResponse.body.vehicle.map(obj => {
    if (obj.routeTag !== null) {

    }
  })

  this.body = jsResponse
}));

app.use(route.get('/subsequentDefaultRouteQueries/:time', function *() {
  this.body = this.jsResponse
}));

// DB Setup
app.use(knex({
  client: 'pg', 
  connection: {
    host: '127.0.0.1',
    database: 'ttc_clustering_dev'
    /** typical knex connection object */
  }
}))

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