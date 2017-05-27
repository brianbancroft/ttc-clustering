// Enforces ORM in app
Sequelize = require('sequelize')

// ===== DATABASE =====

const sequelize = new Sequelize(
  'ttcclusters_development', /*user*/'brianbancroft', /*pass*/'', {
    host: 'localhost',
    dialect: 'postgres',
    timezone: '-05:00',

    pool: {
      max: 5,
      min: 0,
      idle: 10000
    }
  }
)

sequelize
  .authenticate()
  .then(() => {
    console.log('Connected to DB Successful.')
  })
  .catch(err => {
    console.error(`🚫 Bad connection 🚫 -> ${err}`)
  })

exports.BusLocation = sequelize.define('BusLocation', {
  route: Sequelize.INTEGER,
  timeSinceLast: Sequelize.INTEGER,
  is_clustered: Sequelize.BOOLEAN,
  direction_tag: Sequelize.STRING,
  heading: Sequelize.INTEGER,
  point: Sequelize.GEOMETRY('POINT')
})
