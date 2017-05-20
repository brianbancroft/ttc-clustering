const express = require('express')
const router = express.Router()
// Controller dependencies go here
const BusController = require('../controllers/busRecordController')
const HomePageController = require('..//controllers/homePageController')
const { catchErrors } = require('../handlers/errorHandlers')

router.get('/', HomePageController.homePage)

router.post('/request', BusController.ingestBusData)
router.get('/samplequery', BusController.showSampleBusData)
router.get('/turftest', HomePageController.testTurfJS)

// app.get('/turftest', (req, res) => {
//   const point1 = turf.point([-73.123, 40.1234])

//   console.log(point1)
// })


module.exports = router;

