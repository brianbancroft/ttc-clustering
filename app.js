const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const router = express.Router()

var rp = require('request-promise')
const http = require('http')

// ===== TEMPLATING ENGINE (PUG) =====
app.set('views', __dirname + '/views')
app.set('view engine', 'pug')

// ===== MIDDLEWARE =====
const turf = require('@turf/turf')
// var moment = require('moment')
// moment().format()

// Enforces ORM in app
Sequelize = require('sequelize')

// Imports environment variables from .env file
require('dotenv').config({ path: '.env' })

// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// ===== DATABASE =====

const sequelize = new Sequelize('ttcclusters_development', /*user*/'brianbancroft', /*pass*/'', {
  host: 'localhost',
  dialect: 'postgres',
  timezone: '-05:00',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
})

sequelize
  .authenticate()
  .then(err => {
    console.log('Connected to DB Successful.')
  })
  .catch(err => {
    console.error(`🚫 Bad connection 🚫 -> ${err}`)
  })

// ====== MODELS =====

const BusLocation = sequelize.define('BusLocation', {
  route: Sequelize.INTEGER,
  time: Sequelize.TIME,
  is_clustered: Sequelize.BOOLEAN,
  direction_tag: Sequelize.STRING,
  heading: Sequelize.INTEGER,
  point: Sequelize.GEOMETRY('POINT')
})

// ===== CONTROLLERS =====

const HomePageController = {}

HomePageController.homePage = (req, res) => {
  res.render('index', {
    data : {
      title: 'Home Page'
    }
  })
}

const BusRecordController = {}

BusRecordController.ingestBusData = (req, res, next) => {
  NextVehicleArrivalSystem.request()
    .then((data) => {
      // const time = new Date().toISOString()
      
      // gathers all points for clustering comparasion
      const refGeoJSON = GeoJSONConversion.setupBackgroundData(data.vehicle)
      data.vehicle.map((bus) => BusLocation.create(BusLocationSetup.singleInstance(bus, refGeoJSON)))
    })
    .then(() => {
      res.end('Sucess: Data Ingested')
    })
    .catch((err) => {
      res.end(err)
    })
}

// ====== MODULES =====

const NextVehicleArrivalSystem = {}

NextVehicleArrivalSystem.request = () => rp({
  uri: 'http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=ttc&r=60&t=1491951669267',
  headers: {
  'User-Agent': 'Request-Promise'
  },
  json: true
})

const GeoJSONConversion = {}

GeoJSONConversion.setupBackgroundData = data => {
  return {
    type: 'FeatureCollection',
    features: data.map(element => {
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [Number(element.lon), Number(element.lat)]
        },
        properties: {
          id: Number(element.id)
        }
      }
    })
  }
}
GeoJSONConversion.setupSinglePoint = (bus) => turf.point([Number(bus.lon), Number(bus.lat)])

const GeoAnalysis = {}


GeoAnalysis.BusCountWithin = (sourcePoints, comparePoint, radiusInMeters) => { 
  console.log(comparePoint)
  console.log('attempting to buffer')
  const buffer = turf.buffer(comparePoint, radiusInMeters / 1000, 'kilometers')
  console.log(JSON.stringify(buffer))
  console.log('bus count within search started') 
  const result = turf.within(JSON.stringify(comparePoints), buffer)
  console.log('method complete')
  return result
}


const BusLocationSetup = {}

// TODO: 1) Get time, 2) Get Clustered Boolean Value
BusLocationSetup.singleInstance = (bus, refGeoJSON) => {
  console.log('Number of busses within: ', GeoAnalysis.BusCountWithin(refGeoJSON, GeoJSONConversion.setupSinglePoint(bus), 300))

  return {
    route: Number(bus.routeTag),
    // time: time, 
    is_clustered: false,
    direction_tag: bus.dirTag,
    heading: Number(bus.heading),
    point: { type: 'Point', coordinates: [Number(bus.lat),Number(bus.lon)]}
  }
}

// ======= ROUTES ================

router.get('/', HomePageController.homePage)
router.post('/request', BusRecordController.ingestBusData)

app.use('/', router)

// App
app.set('port', process.env.PORT || 3000)
const server = app.listen(app.get('port'), () => {
  console.log(`TTC Clustering app running on PORT -> ${server.address().port}`)
})