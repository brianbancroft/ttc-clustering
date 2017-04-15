const pg = require('pg')
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/ttc_clustering_development'

var moment = require('moment')
moment().format()

const client = new pg.Client(connectionString)
client.connect()

module.exports = {
  // Returns all records
  readRecords: (params) => {
    return client.query(`SELECT (id, route, direction_tag, heading, time,is_clustered, ST_AsGeoJSON(location)) FROM cluster_points WHERE route=${params.route};`)
  },

  // Returns all records within a specific distance
  readRecordsWithinDistance: (params) => {
    return client.query(`SELECT (id, route, direction_tag, heading, time,is_clustered, ST_AsGeoJSON(location)) FROM cluster_points 
    WHERE ST_DWithin(ST_GeomFromText('POINT(${params.long} ${params.lat})'), location, ${params.distance});`)
  },

  // Returns a record with a specific ID
  readRecord: (params) => {
    return client.query(`SELECT (id, route, direction_tag, heading, time,is_clustered, ST_AsGeoJSON(location)) FROM cluster_points 
    WHERE id=${params.id};`)
  },

  // Updates a record. Unsure of what to use. 
  updateClusteredRecord: (params) => {
    client.query(`UPDATE cluster_points
      SET is_clustered = true
      WHERE id=${params.id};`)
  },

  // Creates a new record based from geoData
  insertRecord: (params) => {
    console.log('====== NEW  QUERY ========')
    const queryString = `INSERT INTO cluster_points(route, direction_tag, heading, is_clustered, location)
      VALUES('${params.route}', '${params.directionTag}', ${params.heading}, ${params.isClustered}, ST_GeomFromText('POINT(${params.lon} ${params.lat})', 4326));`
    console.log(queryString)
    client.query(queryString)
    console.log('===== end of query =======`')
  }
}
