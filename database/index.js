const pg = require('pg')
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/ttc_clustering_development'

const client = new pg.Client(connectionString)
client.connect()

module.exports = {
  
  // Returns all records
  readRecords: (params) => {
    client.query(`SELECT (id, route, direction_tag, heading, time,is_clustered, ST_AsGeoJSON(location)) FROM cluster_points WHERE route=${params.route};`)
  },
  readRecordsOnDateOnRoute: (params, callback) => {
    let results = {
      type: 'FeatureCollection',
      features: []
    }

    const query = client.query(`SELECT (id, route, direction_tag, heading, time, is_clustered, ST_AsText(location)) 
      FROM cluster_points
      WHERE route='${params.route}'
      AND extract(month from time) = '${params.month}'
      AND extract(day from time) = '${params.day}'
    ;`)
    query.on('row', (row) => {
      const resultArr = ((row['row'].substring(1, (row['row'].length - 1))).split(','))

      const resultCoords = resultArr[6].substring(7, resultArr[6].length - 2).split(' ')
            
      resultElement = {
        type: 'feature', 
        properties: {
          id: resultArr[0],
          route: resultArr[1],
          directionTag: resultArr[2],
          heading: resultArr[3],
          dateTime: resultArr[4],
          isClustered: resultArr[5] === 't' ? true : false
        },
        geometry: {
          type: 'Point',
          coordinates: [
            resultCoords[0],
            resultCoords[1]
          ]
        }
      }
      results.features.push(resultElement)

    });

    query.on('end', () => {
      callback(results)
    });
  },
  // Returns all records within a specific distance
  readRecordsWithinDistance: (params, callback) => {
    client.query(`SELECT (id, route, direction_tag, heading, time,is_clustered, ST_AsGeoJSON(location)) FROM cluster_points 
    WHERE route='${params.route}'
    AND ST_DWithin(ST_GeomFromText('POINT(${params.lon} ${params.lat})'), location, ${params.distance});`)
    .then((res) => {
      callback(res.rows)
    })
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
    const queryString = `INSERT INTO cluster_points(route, direction_tag, heading, time, is_clustered, location)
      VALUES('${params.route}', '${params.directionTag}', ${params.heading}, '${params.time}', ${params.isClustered}, ST_GeomFromText('POINT(${params.lon} ${params.lat})', 4326));`
    client.query(queryString)
  }
}
