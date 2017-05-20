exports.ingestBusData = (req, res, next) => {
  var options = {
    uri: 'http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=ttc&r=60&t=1491951669267',
    headers: {
    'User-Agent': 'Request-Promise'
    },
    json: true
  }
  rp(options)
    .then(function (payload) {
      next(payload)
    })
    .catch(function (err) {
      console.log(err) 
    })
}

exports.showSampleBusData = (req, res, next) => {
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

// TODO: Create ingest method which takes data for a route on a given day, and displays it as GeoJSON
}