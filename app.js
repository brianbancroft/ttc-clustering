const express = require('express')
const app = express()

const http = require('http')
const https = require('https')
 
app.set('view engine', 'ejs')

function performRequest(endpoint, success, lastTime = 'na') {
  const bareEndPoint = 'http://webservices.nextbus.com/service/publicXMLFeed?command=vehicleLocations&a=ttc&r=60'

  if (lastTime !== 'na') {
    let tempEndPoint = `${bareEndPoint}`
  } else {
    let tempEndPoint = `${bareEndPoint}/t=${lastTime}`
  }

  const req = https.request(options, (res) => {
    res.setEncoding('utf-8')
    let responseString = ''

    res.on('data', (data) => {
      responseString += data
    })

    res.on('end', () => {
      console.log('responseString')
      let responseObject = JSON.parse(responseString)
      success(responseObject)
    })
  })
  req.write(dataString)
  req.end()
}

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/home', (req, res) => {
  res.render('index', { title: 'The Index Page!' })
})

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
})