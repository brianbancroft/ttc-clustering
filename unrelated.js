
var koa = require('koa');
var route = require('koa-route'); //require it
var json = require('koa-json');
var koaPg = require('koa-pg');
var pg = require('pg'); // .native;
var cors = require('koa-cors');
var paramify = require('koa-params');

var Promise = require('bluebird').Promise;
// var Bing = require('node-bing-api')({
//     accKey: 'n5VJI9nk5QVMHDADXJwQTLY5eOS/lWgsuztVLWyIOTc'
// });
var Bing = Promise.promisifyAll(require('node-bing-api')({
    'accKey': 'n5VJI9nk5QVMHDADXJwQTLY5eOS/lWgsuztVLWyIOTc'
}),{
  suffix: 'Async'
});

pg.defaults.ssl = true;

route = paramify(route);
var param = route.param;
var get = route.get;

var app = koa();
var appPort = (process.env.PORT || 3000) ;

app.use(cors());
app.use(koaPg('postgres://dkuuauoezstjor:Lr6qZtm1TlJHJJoellAJd5_Yni@ec2-54-227-245-222.compute-1.amazonaws.com:5432/d2imlo0f5r5jov'));

param('riding', function*(ridingid, next) {

    var query0 = 'SELECT  (ST_AsGeoJSON(geom)) FROM election_boundaries_joined_simp1 WHERE riding_id=' + ridingid; //analog - seek params[:id] analog with this library
    var result = yield this.pg.db.client.query_(query0)

    var query2 = 'SELECT  (riding_nam) FROM election_boundaries_joined_simp1 WHERE riding_id=' + ridingid;
    var ridingNameQuery = yield this.pg.db.client.query_(query2)

    var query3 = 'SELECT (party) FROM election_boundaries_joined_simp1 WHERE riding_id=' + ridingid;
    var partyNameQuery = yield this.pg.db.client.query_(query3)

    this.ridingName = ridingNameQuery.rows[0].riding_nam;
    this.geom = result.rows[0].st_asgeojson;
    this.partyName = partyNameQuery.rows[0].party;

    yield next;
});

param('coordinates', function*(coordinates, next) {
  //USAGE: http://localhost:3000/location/latitude:43.6444194&longitude:-79.3951131
    var latitude = coordinates.split('&')[0].replace("latitude:","");
    var longitude = coordinates.split('&')[1].replace("longitude:","");
    var query = 'SELECT ( riding_id) FROM election_boundaries_joined_simp1 WHERE ST_WITHIN(ST_GeomFromText(\'POINT('+ longitude + ' ' + latitude +')\'),geom);'
    this.riding = yield this.pg.db.client.query_(query)

    yield next;

});

param('name', function*(name, next) {
    console.log("okay, we're starting this here!")
    // 1. Here, we promisfied the Bing Library (see the includes), and it
    // has a suffix of "Async". this means that every single method in that bing library has a second
    // Async Method (capital A), which then returns a promise. This helps us nail down the flow control.
    // 2. When we yield to a promise, it returns a value instead of the promise. It's no longer holding the value
    // inside the promise. The yield returns the value - ~This is kinda a big deal.
    // 3. Because we're using yield, we halt the execution of the function until the yield returns. This is the real value of yields.
    // 4. This.name refers to the param to the left of "next". Here, we assign the value

    this.name =  yield Bing.newsAsync(name, {
        top: 3, // Number of results (max 15)
        skip: 0, // Skip first 3 results
        newsSortBy: "Relevance", //Choices are: Date, Relevance
        newsCategory: "rt_Politics" // Choices are:
    });
    yield next;
})

//=======================      API CALLS     =================================//


app.use(function*(next) {
    yield next;
});

app.use(route.get('/', function*() {
    this.body = {
        message: 'System is working'
    }
}));

app.use(route.get('/news/:name', function*() {
    this.body = {
        results: JSON.parse(this.name.body).d.results
    };
}));

app.use(route.get('/members', function*() {
    var result = yield this.pg.db.client.query_('SELECT * FROM members')
    this.body = result.rows;
    // TODO - Array.map on the rows to ensure normalization. Specifically look at the analysis. 
}));

app.use(route.get('/riding/:riding', function*() {
    this.body = {
        type: "Feature",
        geometry: JSON.parse(this.geom),
        properties: {
            ridingName: this.ridingName,
            partyName: this.partyName,
        },
    };
}));

app.use(route.get('/location/:coordinates', function*() {
    this.body = {
        riding: this.riding.rows[0].riding_id
    }
}));



app.use(json());

app.listen(appPort);
console.log('--- Listening at port ' + appPort);