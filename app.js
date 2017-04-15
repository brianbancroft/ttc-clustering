const express = require('express')
const app = express()

var rp = require('request-promise')
const http = require('http')
var expressVue = require('express-vue')
app.set('views', __dirname + '/views')

app.set('vue', {
    componentsDir: __dirname + '/views/components',
    defaultLayout: 'layout'
});
app.engine('vue', expressVue);
app.set('view engine', 'vue');

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

function addNewRecord (output) {
  // res.render('bus',{ data: output} )
  console.log(Object.keys(output))
  // Obtains last time
  let lastTimeData = output.lastTime.time
  const currentTime =  moment(new Date()).format("YYYY-MM-DD HH:mm:ss")

  output.vehicle.forEach((vehicle) => {
    dbMethods.insertRecord({
      route: 60,
      directionTag: vehicle.dirTag,
      heading: vehicle.heading,
      time: currentTime,
      isClustered: false,
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

app.get('/test-extract', (req, res) => {
  console.log('test extract call')

  dbMethods.readRecordsOnDateOnRoute({
    route: '60',
    month: '4',
    day: '15'
  }, (results) => {
    console.log(results)
    res.render('results', {
      data: {foo: results},
      vue: {
        head: {
          title: 'Sample Data Results for Route 60'
        }
      }
    })
  })
})

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
})