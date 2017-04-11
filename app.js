const express = require('express')
const app = express()

var rp = require('request-promise');
const http = require('http')
// const https = require('https')
 
app.set('view engine', 'ejs')
let output

// function performRequest(callback) {
//     const path = `http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=ttc&r=60&t=1491951669267`

//     const request = new Promise((resolve, reject) => {
//       return http.get(path, (response) => {
//         // Continuously update stream with data
//         let body = '';
//         response.on('data', function(d) {
//             body += d;
//         });
//         response.on('end', function() {
//             console.log(body)
//             // Data reception is done, do whatever with it!
//             const parsed = JSON.parse(body);
//             callback(parsed.message);
//         });
//       });
//     })
// }



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/home', (req, res) => {
  res.render('index', { title: 'The Index Page!' })
})

app.get('/request', (req, res) => {
  // performRequest()
  performRequest((output) => {
    res.render('bus',{ data: output} )
  })

  
})

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
})