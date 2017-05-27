const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const router = express.Router()

const http = require('http')
const useragent = require('express-useragent')
app.use(useragent.express())


// ===== TEMPLATING  =====
app.set('views', __dirname + '/views')
app.set('view engine', 'pug')
const RenderViews = require('./views/RenderViews')

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

// ===== CONTROLLERS =====

const HomePageController = require('./controllers/HomePageController')
const BusRecordController = require('./controllers/BusRecordController')

// ======= ROUTES ================

router.get('/', HomePageController.homePage)
// QP: busses, date
router.get('/busses', BusRecordController.getSampleBusData)
router.post('/request', BusRecordController.ingestBusData)
router.get('*', RenderViews.view404page)

app.use('/', router)

// ====== APP ============
app.set('port', process.env.PORT || 3000)
const server = app.listen(app.get('port'), () => {
  console.log(`TTC Clustering app running on PORT -> ${server.address().port}`)
})

// ===== CRON-LIKE SCHEDULING ========
let counter = 0
busIngestSchedule = new schedule.RecurrenceRule()
counterIncrementSchedule = new schedule.RecurrenceRule()

busIngestSchedule.second = 150
counterIncrementSchedule.second = 10

schedule.scheduleJob(counterIncrementSchedule, () => {
  counter++
  console.log(`Counter Schedule Increment -> Revolution#${counter}`)
})
schedule.scheduleJob(busIngestSchedule, BusRecordController.timedSampleIngest)

console.log('The schdule has been initialzed')