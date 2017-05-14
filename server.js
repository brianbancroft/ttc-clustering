// Imports environment variables from .env file
require('dotenv').config({ path: '.env' })

// App
const app = require('./app')
app.set('port', process.env.PORT || 3000)
const server = app.listen(app.get('port'), () => {
  console.log(`TTC Clustering app running on PORT -> ${server.address().port}`)
})