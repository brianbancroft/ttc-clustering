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
      });
}