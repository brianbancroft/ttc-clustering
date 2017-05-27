const express = require('express')
const app = express()
const bodyParser = require('body-parser')


const http = require('http')
const useragent = require('express-useragent')
app.use(useragent.express())


// ===== TEMPLATING  =====
app.set('views', __dirname + '/views')
app.set('view engine', 'pug')

// ===== MIDDLEWARE =====
// var moment = require('moment')
// moment().format()

// Creates a schedule
const schedule = require('node-schedule')

// Imports environment variables from .env file
require('dotenv').config({ path: '.env' })

// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// ======= ROUTES ================
const router = require('./router')
app.use('/', router)

// ====== APP ============
app.set('port', process.env.PORT || 3000)
const server = app.listen(app.get('port'), () => {
  console.log(`TTC Clustering app running on PORT -> ${server.address().port}`)
})

// ===== CRON-LIKE SCHEDULING ========
const BusRecordController = require('./controllers/BusRecordController')

let inertCounter = 0
let busCounter = 0
busIngestSchedule = new schedule.RecurrenceRule()
counterIncrementSchedule = new schedule.RecurrenceRule()

busIngestSchedule.second = 300
counterIncrementSchedule.second = 10

schedule.scheduleJob(counterIncrementSchedule, () => {
  inertCounter++
  console.log(`Ten-second counter -> Revolution#${inertCounter}`)
})
schedule.scheduleJob(busIngestSchedule, () => {
  busCounter++
  console.log(`Five-minute interveal bus collection starting. This is serial number -> ${busCounter}`)

  BusRecordController.timedSampleIngest
})

console.log('The schedule has been initialzed')