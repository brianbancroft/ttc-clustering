const express = require('express')
const app = express()

var rp = require('request-promise')
const http = require('http')
var expressVue = require('express-vue')
app.set('views', __dirname + '/views')

app.set('vue', {
    componentsDir: __dirname + '/views/components',
    defaultLayout: 'layout'
})
app.engine('vue', expressVue)
app.set('view engine', 'vue')

const dbMethods = require('./database/')
var moment = require('moment')
moment().format()

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

function isBusClose (params) {
  const distance = 75 //75 metres
  let busIsClose = false



  dbMethods.readRecordsWithinDistance({
    lat: params.lat,
    lon: params.lon,
    route: params.route,
    distance: distance
  }, (results) => {
    if (results.length > 0) {
      busIsClose = true
      results.map((result) => {
        const row = result.row.substring(
          1,
          (result.row.length - 1)
        ).split(',')
        // TODO: Further query Restrictions
        if (row[5] === 'f') {
          dbMethods.updateClusteredRecord({
            id: Number(row[0])
          })
        }
      })
    }
  })

  return busIsClose
}

function addNewRecord (output) {
  // res.render('bus',{ data: output} )
  // Obtains last time
  let lastTimeData = output.lastTime.time
  const currentTime =  moment(new Date()).format("YYYY-MM-DD HH:mm:ss")

  output.vehicle.forEach((vehicle) => {
    dbMethods.insertRecord({
      route: '60',
      directionTag: vehicle.dirTag,
      heading: vehicle.heading,
      time: currentTime,
      isClustered: isBusClose({
        lon: vehicle.lon,
        lat: vehicle.lat,
        route: '60'
      }),
      lon: vehicle.lon,
      lat: vehicle.lat,
    })
  }, this)
}

// ======= ROUTES ================

app.get('/', (req, res, next) => {
  res.render('index', {
    data : {
      otherData: 'Something Else'
    },
    vue: {
      head: {
        title: 'Page Title',
      }
    }
  })
})

app.get('/request', (req, res) => {
  performRequest(addNewRecord) 
})

app.get('/panel', (req, res) => {
  res.render('adminPanel', {
    data : {
      busRoutes: [60, 1,2,3,4,5]
    },
    vue: {
      head: {
        title: 'Page Title',
      }
    }
  })
})

app.get('/test-extract', (req, res) => {
  dbMethods.readRecordsOnDateOnRoute({
    route: '60',
    month: '4',
    day: '15'
  }, (results) => {
    res.write(JSON.stringify(results))
  })
})

// OTHER ROUTES
/*
1. Admin Panel
2. Set Job
3. Obtain all data on specific date for Specific Route
*/

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
})