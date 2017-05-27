const express = require('express')
const router = new express.Router()

const HomePageController = require('../controllers/HomePageController')
const BusRecordController = require('../controllers/BusRecordController')
const RenderViews = require('../views/RenderViews')

router.get('/', HomePageController.homePage)
// QP: busses, date
router.get('/busses', BusRecordController.getSampleBusData)
router.post('/request', BusRecordController.ingestBusData)
router.get('*', RenderViews.view404page)

module.exports = router
