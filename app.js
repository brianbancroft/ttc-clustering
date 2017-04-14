const express = require('express')
const app = express()

var rp = require('request-promise')
const http = require('http')

app.set('view engine', 'ejs')
let output

const pg = require('pg')
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/ttc_clustering_development'

const client = new pg.Client(connectionString)
client.connect()

// Returns all records for a given route on a specific day (for dataviz)
function readRecords(params) {
    return client.query(`SELECT (id, route, direction_tag, heading, time,is_clustered, ST_AsGeoJSON(location)) FROM cluster_points WHERE route=${params.route};`)
}

// Returns all records within a specific distance
function readRecordsWithinDistance(params) {
  return client.query(`SELECT (id, route, direction_tag, heading, time,is_clustered, ST_AsGeoJSON(location)) FROM cluster_points 
  WHERE ST_DWithin(ST_GeomFromText('POINT(${params.long} ${params.lat})'), location, ${params.distance});`)
}

// Returns a record with a specific ID
function readRecord(params) {
  return client.query(`SELECT (id, route, direction_tag, heading, time,is_clustered, ST_AsGeoJSON(location)) FROM cluster_points 
  WHERE id=${params.id};`)
}

// Updates a record. Unsure of what to use. 
function updateClusteredRecord(params) {
  client.query(`UPDATE cluster_points
    SET is_clustered = true
    WHERE id=${params.id};`)
}

// Creates a new record based from geoData
function insertRecord(params) {
  console.log('====== NEW  QUERY ========')
  const queryString = `INSERT INTO cluster_points(route, direction_tag, heading, is_clustered, location)
    VALUES('${params.route}', '${params.directionTag}', ${params.heading}, ${params.isClustered}, ST_GeomFromText('POINT(${params.lon} ${params.lat})', 4326));`
  console.log(queryString)
  client.query(queryString)
  console.log('===== end of query =======`')
}

function performRequest(callback) {

  var options = {
      uri: 'http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=ttc&r=60&t=1491951669267',
      headers: {
          'User-Agent': 'Request-Promise'
      },
      json: true
  }
  
  rp(options)
      .then(function (payload) {
          callback(payload)
      })
      .catch(function (err) {
          console.log(err) 
      });
}

function getRightParams(params) {
  console.log('=========== New Bus ============')
  console.log(`ID: ${params.id}`)
  console.log(`routeTag: ${params.routeTag}`)
  console.log(`direction tag: ${params.dirTag}`)
  console.log(`Heading: ${params.heading}`)
  console.log(`Time since last report: ${params.secsSinceReport}`)
  console.log(`Latitude: ${params.lat}`)
  console.log(`Longitude: ${params.lon}`)
  console.log('-------- end of record --------')
}

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/home', (req, res) => {
  res.render('index', { title: 'The Index Page!' })
})

app.get('/retrieve', (req, res) => {
  res.render('index', { title: 'The retrieve page' })
})

app.get('/request', (req, res) => {
  // performRequest()
  performRequest((output) => {
    // res.render('bus',{ data: output} )
    console.log(Object.keys(output))
    // Obtains last time
    let lastTimeData = output.lastTime.time
    const currentTime = new Date()

    output.vehicle.forEach((vehicle) => {
      insertRecord({
        route: 60,
        directionTag: vehicle.dirTag,
        heading: vehicle.heading,
        time: currentTime,
        isClustered: false,
        lon: vehicle.lon,
        lat: vehicle.lat,
      })
    }, this);
  }) 
})

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
})