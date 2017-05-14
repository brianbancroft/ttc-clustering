const pg = require('pg')

// Database connection parameters

const config = {
  host: process.env.DATABASE_URL || 'postgres://localhost:5432/ttc_clustering_development',
  max: 10,
  idleTimeOutMillis: 30000
}
const pool = new pg.Pool(config)

pool.on('error', (err, client) => {
  console.error(`🚫 DB 🚫 → ${err.message}; ${err.stack}`)
})

// NEW SYNTAX

//export the query method for passing queries to the pool
module.exports.query = function (text, values, callback) {
  console.log('query:', text, values);
  return pool.query(text, values, callback);
};

// the pool also supports checking out a client for
// multiple operations, such as a transaction
module.exports.connect = (callback) => {
  return pool.connect(callback);
};

// Returns all records
module.exports.readRecords = (params) => {
  client.query(`SELECT (id, route, direction_tag, heading, time,is_clustered, ST_AsGeoJSON(location)) FROM cluster_points WHERE route=${params.route};`)
}

module.exports.readRecordsOnDateOnRoute = (params, callback) => {
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
      type: 'Feature', 
      properties: {
        id: Number(resultArr[0]),
        route: Number(resultArr[1]),
        directionTag: resultArr[2],
        heading: Number(resultArr[3]),
        dateTime: resultArr[4],
        isClustered: resultArr[5] === 't' ? true : false
      },
      geometry: {
        type: 'Point',
        coordinates: [
          Number(resultCoords[0]),
          Number(resultCoords[1])
        ]
      }
    }
    results.features.push(resultElement)

  })

  query.on('end', () => {
    callback(results)
  })
}

  // Returns all records within a specific distance
module.exports.readRecordsWithinDistance = (params, callback) => {
  client.query(`SELECT (id, route, direction_tag, heading, time,is_clustered) FROM cluster_points 
  WHERE route='${params.route}'
  AND ST_DWithin(ST_GeomFromText('POINT(${params.lon} ${params.lat})'), location, ${params.distance});`)
  .then((res) => {
    callback(res.rows)
  })
}

// Returns a record with a specific ID
module.exports.readRecord = (params) => {
  return client.query(`SELECT (id, route, direction_tag, heading, time,is_clustered, ST_AsGeoJSON(location)) FROM cluster_points 
  WHERE id=${params.id};`)
},

// Updates a record. Unsure of what to use. 
module.exports.updateClusteredRecord = (params) => {
  client.query(`UPDATE cluster_points
    SET is_clustered = true
    WHERE id=${params.id};`)
    .then((res) => {
      console.log(`call finished. result: ${res}`)
    })
}

  // Creates a new record based from geoData
module.exports.insertRecord = (params) => {
  const queryString = `INSERT INTO cluster_points(route, direction_tag, heading, time, is_clustered, location)
    VALUES('${params.route}', '${params.directionTag}', ${params.heading}, '${params.time}', ${params.isClustered}, ST_GeomFromText('POINT(${params.lon} ${params.lat})', 4326));`
  client.query(queryString)
}

