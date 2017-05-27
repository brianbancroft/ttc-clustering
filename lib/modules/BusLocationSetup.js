const GeoJSONConversion = require('./GeoJSONConversion')
const GeoAnalysis = require('./GeoAnalysis')

exports.singleInstance = (bus, refGeoJSON) => {
  return {
    route: Number(bus.routeTag),
    is_clustered: GeoAnalysis.busCountWithin(
      refGeoJSON, GeoJSONConversion.setupSinglePoint(bus), 75
      ) > 1,
    direction_tag: bus.dirTag,
    timeSinceLast: bus.secsSinceReport,
    heading: Number(bus.heading),
    point: {type: 'Point', coordinates: [Number(bus.lon),Number(bus.lat)]}
  }
}
