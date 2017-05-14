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

module.exports = router;

