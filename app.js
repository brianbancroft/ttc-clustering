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
function readRecords(route, date) {

}

// Returns all records within a specific distance
function readRecordsWithinDistance(distance, route, heading, time) {

}

// Returns a record with a specific ID
function readRecord(id) {

}

// Updates a record. Unsure of what to use. 
function updateRecord(params) {

}
function insertRecord(params) {
  client.query(`INSERT INTO cluster_points(route, direction_tag, heading, time, is_clustered, location)
    VALUES('${params.route}, ${params.directionTag}, ${params.heading}, ${params.time}, ${params.isClustered}, ST_GeomFromText('POINT(${params.long} ${params.lat})', 4326));`)
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
    console.log(lastTimeData)
    
    console.log(Object.keys(output.vehicle))
    output.vehicle.forEach((vehicle) => {
      // TODO -> UPLOAD TO PostGIS. 
      console.log(vehicle)
    }, this);
  })

  
})

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
})