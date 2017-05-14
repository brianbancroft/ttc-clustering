Sequelize = require('sequelize')
// Imports environment variables from .env file

require('dotenv').config({ path: '.env' })

// Database
const sequelize = new Sequelize('ttcclusters_development', /*user*/'brianbancroft', /*pass*/'', {
  host: 'localhost',
  dialect: 'postgres',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
})
sequelize
  .authenticate()
  .then(err => {
    console.log('Connected to DB Successful.')
  })
  .catch(err => {
    console.error(`🚫 Bad connection 🚫 -> ${err}`)
  })
// Models



// App
const app = require('./app')
app.set('port', process.env.PORT || 3000)
const server = app.listen(app.get('port'), () => {
  console.log(`TTC Clustering app running on PORT -> ${server.address().port}`)
})