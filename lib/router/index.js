const express = require('express')
const router = new express.Router()

const HomeController = require('../controllers/HomeController')
const BusRecordController = require('../controllers/BusRecordController')

router.get('/', HomeController.homePage)
// QP: busses, date
router.get('/route', BusRecordController.getSampleBusData)
router.post('/request', BusRecordController.ingestBusData)
router.get('*', HomeController.view404page)

module.exports = router
