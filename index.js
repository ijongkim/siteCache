const express = require('express')
const app = express()
const dotenv = require('dotenv').config()
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000
const utils = require('./serverUtils.js')
const db = require('./db.js')

// Set middleware for POST requests and static file requests
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('client'))

// Expose GET endpoint
app.get('/storage', function (req, res) {
  let id = req.query.id
  // Verify ID is of valid format (only numbers, no leading zeros)
  if (utils.verifyID(id)) {
    // Initiate DB check and send response
    db.checkJob(res, id)
  } else {
    // Respond with invalid ID error
    res.send(`<html><body><h1>Sorry, we were unable to process your request, your request for job number "${id}" is invalid. Please check your job number and try again. Refresh to try again.</h1></body></html>`)
  }
})

// Expose POST endpoint
app.post('/storage', function (req, res) {
  let url = req.body.url
  // Check url before inserting into DB
  if (utils.verifyURL(url)) {
    // Insert url into database and send response
    db.queueJob(res, url)
  } else {
    // Respond with invalid URL error
    res.send(`<html><body><h1>Sorry, we were unable to process your request, "${url}" is invalid. Please check your URL and try again. Refresh to try again.</h1></body></html>`)
  }
})

// Initialize server
app.listen(port, function () {
  console.log('Server listening on', port)
})

// Initiate processing of queue
db.processQueue()
