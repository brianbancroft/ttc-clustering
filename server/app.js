const koa = require('koa')
const json = require('koa-json')
const xml = require('koa-xml')
let route = require('koa-route') // For calling specific routes
let request = require('koa-request')  // For RESTful requests
let paramify = require('koa-params') 
var koaPg = require('koa-pg');
let pg = require('pg'); // .native;
let cors = require('koa-cors')
let parser = require('xml2js').parseString;

// pg.defaults.ssl = true;

route = paramify(route);
let param = route.param;
let get = route.get;

let app = koa();
let appPort = (process.env.PORT || 3000)
app.use(cors());
app.use(koaPg('postgres://brianbancroft@localhost:5432/ttc_clustering_dev'));


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

  let i = 0
  while (i < jsResponse.body.vehicle.length) {
    console.log('======== NEW ITEM ==========')
    console.log(jsResponse.body.vehicle[i].$)
    let query_content = `INSERT INTO temp_records (route_id, bus_id, capture_time, geometry) VALUES ('60', '${jsResponse.body.vehicle[i].$.id}', ${Date.now() - (jsResponse.body.vehicle[i].$.secsSinceReport * 1000)}, ST_GeomFromText('POINT(${jsResponse.body.vehicle[i].$.lng} ${jsResponse.body.vehicle[i].$.lat})'))` 
    
    debugger;
    let result = yield pg.db.client.query_(query_content)
    console.log('result:' + result)
    i += 1;
  }
  // jsResponse.body.vehicle.map(function (obj) {
  //   if (obj.routeTag !== null) {
  //     let query_content = `INSERT INTO temp_records (route_id, bus_id, capture_time, geometry) VALUES ('60', '${obj.$.id}', ${Date.now() - (obj.$.secsSinceReport * 1000)}, ST_GeomFromText('POINT(${obj.$.lng} ${obj.$.lat})'))`
  //     var result = yield pg.db.client.query_(query_content)
  //     console.log('result:' + result)
  // }});

  this.body = 'Finished!'
}));

app.use(route.get('/defaultRouteQueries/:time', function *() {
  this.body = this.jsResponse
}));

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