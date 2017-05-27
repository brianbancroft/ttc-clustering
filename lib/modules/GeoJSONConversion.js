const turf = require('@turf/turf')

exports.setupPointCollection = data => turf.featureCollection(data.map(element => GeoJSONConversion.setupSinglePoint(element)))

exports.setupSinglePoint = (bus => turf.point([Number(bus.lon), Number(bus.lat)], {dirTag: bus.dirTag ? bus.dirTag : 'null_null_null'}))
