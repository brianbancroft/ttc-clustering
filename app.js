const express = require('express')
const app = express()

const http = require('http')
const https = require('https')
 
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/home', (req, res) => {
  res.render('index', { title: 'The Index Page!' })
})

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
})