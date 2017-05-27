const turf = require('@turf/turf')

exports.BusCountWithin = (sourcePoints, comparePoint, radiusInMeters) => turf.within(sourcePoints, turf.featureCollection([turf.buffer(comparePoint, radiusInMeters / 1000, 'kilometers')])).features.filter(element => element.properties.dirTag.split('_')[1] === comparePoint.properties.dirTag.split('_')[1]).length