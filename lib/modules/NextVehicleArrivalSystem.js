var rp = require('request-promise')

exports.request = (options) => rp({
  uri: 'http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=ttc&r='
    .concat(options.route)
    .concat('&t=1491951669267'),
  headers: {
  'User-Agent': 'Request-Promise'
  },
  json: true
})
