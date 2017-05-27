const Model = require('../models/')
const GeoJSONConversion = require('../modules/GeoJSONConversion')
const NextVehicleArrivalSystem = require('../modules/NextVehicleArrivalSystem')

exports.ingestBusData = (req, res) => {
  NextVehicleArrivalSystem.request({route: '60'})
    .then((data) => {
      // const time = new Date().toISOString()
      // gathers all points for clustering comparasion
      const refGeoJSON = GeoJSONConversion.setupPointCollection(data.vehicle)
      data.vehicle.map((bus) => Model.BusLocation.create(
        BusLocationSetup.singleInstance(bus, refGeoJSON))
      )
    })
    .then(() => {
      res.end('Sucess: Data Ingested')
    })
    .catch((err) => {
      res.end(err)
    })
}

exports.getSampleBusData = (req, res) => {
  // TODO: Get route, date params from query
  if (req.query.route) {
    Model.BusLocation.all({where: {route: req.query.route}}).then(data => {
      if (data.length > 0) {
        res.render('map', {
          data : {
            title: 'Data obtained',
            geodata: JSON.stringify(turf.featureCollection(data.map(
              element => turf.point(
                element.point.coordinates, {dirTag: element.direction_tag}))
              )
            )
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

exports.timedSampleIngest = () => {
  console.log('===== NEW TIMED INGEST =======')
  NextVehicleArrivalSystem.request({route: '60'})
  .then((data) => {
    // const time = new Date().toISOString()
    // gathers all points for clustering comparasion
    const refGeoJSON = GeoJSONConversion.setupPointCollection(data.vehicle)
    data.vehicle.map(
      (bus) => Model.BusLocation.create(
        Model.BusLocationSetup.singleInstance(bus, refGeoJSON)
      )
    )
  })
  .then(() => {
    console.log('Sample Ingest successful')
  })
  .catch((err) => {
    console.warn('Sample Ingest failed', err)
  })
}
