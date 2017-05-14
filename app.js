const express = require('express')
const app = express()

var rp = require('request-promise')
const http = require('http')

// Template engine setup
app.set('views', __dirname + '/views')
app.set('view engine', 'pug')

// Middleware
// const turf = require('@turf/turf')
// var moment = require('moment')
// moment().format()

const dbMethods = require('./database/')
const routes = require('./routes/index')



// function isBusClose (params) {
//   const distance = 75 //75 metres
//   let busIsClose = false



//   dbMethods.readRecordsWithinDistance({
//     lat: params.lat,
//     lon: params.lon,
//     route: params.route,
//     distance: distance
//   }, (results) => {
//     if (results.length > 0) {
//       busIsClose = true
//       results.map((result) => {
//         const row = result.row.substring(
//           1,
//           (result.row.length - 1)
//         ).split(',')
//         // TODO: Further query Restrictions
//         if (row[5] === 'f') {
//           dbMethods.updateClusteredRecord({
//             id: Number(row[0])
//           })
//         }
//       })
//     }
//   })

//   return busIsClose
// }

// function addNewRecord (output) {
//   // res.render('bus',{ data: output} )
//   // Obtains last time
//   let lastTimeData = output.lastTime.time
//   const currentTime =  moment(new Date()).format("YYYY-MM-DD HH:mm:ss")

//   output.vehicle.forEach((vehicle) => {
//     dbMethods.insertRecord({
//       route: '60',
//       directionTag: vehicle.dirTag,
//       heading: vehicle.heading,
//       time: currentTime,
//       isClustered: isBusClose({
//         lon: vehicle.lon,
//         lat: vehicle.lat,
//         route: '60'
//       }),
//       lon: vehicle.lon,
//       lat: vehicle.lat,
//     })
//   }, this)
// }

// ======= ROUTES ================

app.use('/', routes);



module.exports = app;