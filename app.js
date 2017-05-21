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
  timeSinceLast: Sequelize.INTEGER,
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

BusRecordController.ingestBusData = (req, res) => {
  NextVehicleArrivalSystem.request()
    .then((data) => {
      // const time = new Date().toISOString()
      
      // gathers all points for clustering comparasion
      const refGeoJSON = GeoJSONConversion.setupPointCollection(data.vehicle)
      data.vehicle.map((bus) => BusLocation.create(BusLocationSetup.singleInstance(bus, refGeoJSON)))
    })
    .then(() => {
      res.end('Sucess: Data Ingested')
    })
    .catch((err) => {
      res.end(err)
    })
}

BusRecordController.getSampleBusData = (req, res) => {
  // TODO: Get route, date params from query
  const route = '60'
  BusLocation.all({where: {route: route}}).then(data => {
    console.log(JSON.stringify(data))
    res.render('map', {
    data : {
      title: 'Data obtained',
      geodata: JSON.stringify(turf.featureCollection(data.map(element => turf.point(element.point.coordinates, {dirTag: element.direction_tag}))))
    }
  })
  }).catch(err => {
    res.render('index', {
      data: {
        title: err
      }
    })
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

GeoJSONConversion.setupPointCollection = data => turf.featureCollection(data.map(element => GeoJSONConversion.setupSinglePoint(element)))

GeoJSONConversion.setupSinglePoint = (bus => turf.point([Number(bus.lon), Number(bus.lat)], {dirTag: bus.dirTag ? bus.dirTag : 'null_null_null'}))

const GeoAnalysis = {}

GeoAnalysis.BusCountWithin = (sourcePoints, comparePoint, radiusInMeters) => turf.within(sourcePoints, turf.featureCollection([turf.buffer(comparePoint, radiusInMeters / 1000, 'kilometers')])).features.filter(element => element.properties.dirTag.split('_')[1] === comparePoint.properties.dirTag.split('_')[1]).length

const BusLocationSetup = {}

BusLocationSetup.singleInstance = (bus, refGeoJSON) => {
  return {
    route: Number(bus.routeTag),
    is_clustered: GeoAnalysis.BusCountWithin(refGeoJSON, GeoJSONConversion.setupSinglePoint(bus), 75) > 1,
    direction_tag: bus.dirTag,
    timeSinceLast: bus.secsSinceReport,
    heading: Number(bus.heading),
    point: { type: 'Point', coordinates: [Number(bus.lon),Number(bus.lat)]}
  }
}

// ======= ROUTES ================

router.get('/', HomePageController.homePage)
router.get('/busses', BusRecordController.getSampleBusData)
router.post('/request', BusRecordController.ingestBusData)

app.use('/', router)

// App
app.set('port', process.env.PORT || 3000)
const server = app.listen(app.get('port'), () => {
  console.log(`TTC Clustering app running on PORT -> ${server.address().port}`)
})