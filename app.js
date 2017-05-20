const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const router = express.Router()

Sequelize = require('sequelize')
// Imports environment variables from .env file

require('dotenv').config({ path: '.env' })

var rp = require('request-promise')
const http = require('http')

// Template engine setup
app.set('views', __dirname + '/views')
app.set('view engine', 'pug')

// Middleware
const turf = require('@turf/turf')
var moment = require('moment')
moment().format()


// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// ===== DATABASE =====

const sequelize = new Sequelize('ttcclusters_development', /*user*/'brianbancroft', /*pass*/'', {
  host: 'localhost',
  dialect: 'postgres',

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

const BusLocation = (sequelize, DataTypes) => sequelize.define('BusLocation', {
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

HomePageController.turfTest = (req, res) => {
  // app.get('/turftest', (req, res) => {
//   const point1 = turf.point([-73.123, 40.1234])

//   console.log(point1)
// })
  res.render('index', {})
}

const BusRecordController = {}

BusRecordController.ingestBusData = (req, res, next) => {
  NextVehicleArrivalSystem.request()
    .then((data) => {
      console.log(data)
    })
    .catch((err) => {
      consol.warn(error)
    })
}

// BusRecordController.showSampleBusData = (req, res, next) => {
// ORIGINAL FUNCTION: 
// app.get('/sample', (req, res) => {
//   dbMethods.readRecordsOnDateOnRoute({
//     route: '60',
//     month: '4',
//     day: '15'
//   }, (results) => {
//     res.write(JSON.stringify({foo: 'bar'}))
//   })
// })


// *----- SAMPLE READ ALL RECORDS CALL -----*
// module.exports.readRecordsOnDateOnRoute = (params, callback) => {
//   let results = {
//     type: 'FeatureCollection',
//     features: []
//   }

//   const query = client.query(`SELECT (id, route, direction_tag, heading, time, is_clustered, ST_AsText(location)) 
//     FROM cluster_points
//     WHERE route='${params.route}'
//     AND extract(month from time) = '${params.month}'
//     AND extract(day from time) = '${params.day}'
//   ;`)
//   query.on('row', (row) => {
//     const resultArr = ((row['row'].substring(1, (row['row'].length - 1))).split(','))

//     const resultCoords = resultArr[6].substring(7, resultArr[6].length - 2).split(' ')
          
//     resultElement = {
//       type: 'Feature', 
//       properties: {
//         id: Number(resultArr[0]),
//         route: Number(resultArr[1]),
//         directionTag: resultArr[2],
//         heading: Number(resultArr[3]),
//         dateTime: resultArr[4],
//         isClustered: resultArr[5] === 't' ? true : false
//       },
//       geometry: {
//         type: 'Point',
//         coordinates: [
//           Number(resultCoords[0]),
//           Number(resultCoords[1])
//         ]
//       }
//     }
//     results.features.push(resultElement)

//   })

//   query.on('end', () => {
//     callback(results)
//   })
// }
// * ----- END SAMPLE CALL ----- * 

// ====== MODULES =====

const NextVehicleArrivalSystem = {}

NextVehicleArrivalSystem.request = () => rp({
  uri: 'http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=ttc&r=60&t=1491951669267',
  headers: {
  'User-Agent': 'Request-Promise'
  },
  json: true
})

NextVehicleArrivalSystem.checkForClustering = (records) => {
  // TODO: Using turf.js, determine whether busses are within 75m
}

// function isBusClose (params) {
//   const distance = 75 //75 metres
//   let busIsClose = false

//   dbMethods.readRecordsWithinDistance({
//     lat: params.lat,
//     lon: params.lon,
//     route: params.route,
//     distance: distance
//   }, (results) => {
//     if (results.length > 0) {
//       busIsClose = true
//       results.map((result) => {
//         const row = result.row.substring(
//           1,
//           (result.row.length - 1)
//         ).split(',')
//         // TODO: Further query Restrictions
//         if (row[5] === 'f') {
//           dbMethods.updateClusteredRecord({
//             id: Number(row[0])
//           })
//         }
//       })
//     }
//   })

//   return busIsClose
// }

// function addNewRecord (output) {
//   // res.render('bus',{ data: output} )
//   // Obtains last time
//   let lastTimeData = output.lastTime.time
//   const currentTime =  moment(new Date()).format("YYYY-MM-DD HH:mm:ss")

//   output.vehicle.forEach((vehicle) => {
//     dbMethods.insertRecord({
//       route: '60',
//       directionTag: vehicle.dirTag,
//       heading: vehicle.heading,
//       time: currentTime,
//       isClustered: isBusClose({
//         lon: vehicle.lon,
//         lat: vehicle.lat,
//         route: '60'
//       }),
//       lon: vehicle.lon,
//       lat: vehicle.lat,
//     })
//   }, this)
// }

// ======= ROUTES ================

// Controller dependencies go here
// const BusController = require('../controllers/busRecordController')
// const HomePageController = require('..//controllers/homePageController')
// const { catchErrors } = require('../handlers/errorHandlers')

router.get('/', HomePageController.homePage)
router.post('/request', BusRecordController.ingestBusData)
// router.get('/samplequery', BusRecordController.showSampleBusData)
// router.get('/turftest', HomePageController.testTurfJS)

app.use('/', router)

// App
app.set('port', process.env.PORT || 3000)
const server = app.listen(app.get('port'), () => {
  console.log(`TTC Clustering app running on PORT -> ${server.address().port}`)
})