const express = require('express')
const app = express()

var rp = require('request-promise')
const http = require('http')
var moment = require('moment')
moment().format()


app.set('view engine', 'ejs')


// ===== FUTURE SCOPE: MIGRATE FROM EJS TO VUE ====
// var expressVue = require('express-vue')
// app.set('views', __dirname + '/app/views')
 
// //Optional if you want to specify the components directory separate to your views, and/or specify a custom layout. 
// app.set('vue', {
//     //ComponentsDir is optional if you are storing your components in a different directory than your views 
//     componentsDir: __dirname + '/components',
//     //Default layout is optional it's a file and relative to the views path, it does not require a .vue extension. 
//     //If you want a custom layout set this to the location of your layout.vue file. 
//     defaultLayout: 'layout'
// });
// app.engine('vue', expressVue);
// app.set('view engine', 'vue');

// ====== END FUTURE SCOPE ===========

const dbMethods = require('./database/')


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
    const currentTime = new Date()

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
    }, this);
  }) 
})

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
})