const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const router = express.Router()

var rp = require('request-promise')
const http = require('http')
const useragent = require('express-useragent')
app.use(useragent.express())


// ===== TEMPLATING ENGINE (PUG) =====
app.set('views', __dirname + '/views')
app.set('view engine', 'pug')

// ===== MIDDLEWARE =====
const turf = require('@turf/turf')
// var moment = require('moment')
// moment().format()

// Enforces ORM in app
Sequelize = require('sequelize')

// Creates a schedule

const schedule = require('node-schedule')

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

HomePageController.homePage = (req, res) => req.useragent.isMobile ? RenderViews.mobileIndex(req, res) : RenderViews.desktopIndex(req, res)

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
  if (req.query.route) { 
    BusLocation.all({where: {route: req.query.route}}).then(data => {
      if (data.length > 0) {
        res.render('map', {
          data : {
            title: 'Data obtained',
            geodata: JSON.stringify(turf.featureCollection(data.map(element => turf.point(element.point.coordinates, {dirTag: element.direction_tag}))))
          }
        })
      } else {
        res.render('desktop/index', {
          data: {
            title: 'No data returned from request'
          }
        })
      }
    }).catch(err => {
      res.render('desktop/index', {
        data: {
          title: err
        }
      })
    })
  } else { 
    res.render('desktop/index', {
      data: {
        title: 'Page requires route query param'
      }
    })
  }
}

BusRecordController.timedSampleIngest = () => {
  console.log('===== NEW TIMED INGEST =======')
  NextVehicleArrivalSystem.request()
  .then((data) => {
    // const time = new Date().toISOString()
    
    // gathers all points for clustering comparasion
    const refGeoJSON = GeoJSONConversion.setupPointCollection(data.vehicle)
    data.vehicle.map((bus) => BusLocation.create(BusLocationSetup.singleInstance(bus, refGeoJSON)))
  })
  .then(() => {
    console.log('Sample Ingest successful')
  })
  .catch((err) => {
    console.warn('Sample Ingest failed', err)
  })
}

// ====== VIEWS ======

const RenderViews = {}

RenderViews.mobileIndex = (req, res) => res.render('mobile/index')
RenderViews.desktopIndex = (req, res) => res.render('desktop/index')
RenderViews.view404page = (req, res) => res.render('mobile/errorpage', {data: {error: 'Page not found'}})

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
// QP: busses, date
router.get('/busses', BusRecordController.getSampleBusData)
router.post('/request', BusRecordController.ingestBusData)
router.get('*', RenderViews.view404page)

app.use('/', router)

// ====== APP ============
app.set('port', process.env.PORT || 3000)
const server = app.listen(app.get('port'), () => {
  console.log(`TTC Clustering app running on PORT -> ${server.address().port}`)
})

// ===== CRON-LIKE SCHEDULING ========
let counter = 0
busIngestSchedule = new schedule.RecurrenceRule()
counterIncrementSchedule = new schedule.RecurrenceRule()

busIngestSchedule.second = 150
counterIncrementSchedule.second = 10

schedule.scheduleJob(counterIncrementSchedule, () => {
  counter++
  console.log(`Counter Schedule Increment -> Revolution#${counter}`)
})
schedule.scheduleJob(busIngestSchedule, BusRecordController.timedSampleIngest)

console.log('The schdule has been initialzed')