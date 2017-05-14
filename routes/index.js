const express = require('express');
const router = express.Router();
// Controller dependencies go here
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', (req, res, next) => {
  res.render('index', {
    data : {
      otherData: 'Home Page'
    }
  })
})

// app.get('/request', (req, res) => {
//   performRequest(addNewRecord) 
// })

// app.get('/panel', (req, res) => {
//   res.render('adminPanel', {
//     data : {
//       busRoutes: [60, 1,2,3,4,5]
//     }
//   })
// })

// app.get('/turftest', (req, res) => {
//   const point1 = turf.point([-73.123, 40.1234])

//   console.log(point1)
// })

// app.get('/sample', (req, res) => {
//   dbMethods.readRecordsOnDateOnRoute({
//     route: '60',
//     month: '4',
//     day: '15'
//   }, (results) => {
//     res.write(JSON.stringify({foo: 'bar'}))
//   })
// })

module.exports = router;

