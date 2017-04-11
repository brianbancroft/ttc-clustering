const express = require('express')
const app = express()

var rp = require('request-promise');
const http = require('http')
 
app.set('view engine', 'ejs')
let output

function performRequest(callback) {

  var options = {
      uri: 'http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=ttc&r=60&t=1491951669267',
      // qs: {
      //     access_token: 'xxxxx xxxxx' // -> uri + '?access_token=xxxxx%20xxxxx' 
      // },
      headers: {
          'User-Agent': 'Request-Promise'
      },
      json: true // Automatically parses the JSON string in the response 
  };
  
  rp(options)
      .then(function (payload) {
          callback(payload);
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