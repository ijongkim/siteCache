const express = require('express')
const app = express()
const dotenv = require('dotenv').config()
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000
const utils = require('./serverUtils.js')
const db = require('./db.js')

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('client'))

app.get('/storage', function (req, res) {
  let id = req.query.id
  // Verify ID is of valid format (all numbers)
  if (utils.verifyID(id)) {
    // Initiate DB check and response
    let response = db.checkJob(id)
    res.send(response)
  } else {
    // Respond with invalid ID
    let response = `<html><body><h1>Sorry, "${id}" is not a valid ID</h1></body></html>`
    res.send(response)
  }
})

app.post('/storage', function (req, res) {
  // Sanitize url before inserting into DB
  let url = utils.sanitizeURL(req.body.url)
  // Insert url into database, returns job number
  let jobNum = db.queueJob(url)
  // If jobNum is valid
  if (jobNum >= 0) {
    let response = `<html><body><h1>Your request has been received. Your job number is ${jobNum}. Use this number to check the status of your request and retrieve your cached result.</h1></body></html>`
    res.send(response)
  } else {
    let response = `<html><body><h1>Sorry, we were unable to process your request. We apologize for the inconvenience, please try again later.</h1></body></html>`
    res.send(response)
  }
})

app.listen(port, function () {
  console.log('Server listening on', port)
})
