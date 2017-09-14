const express = require('express')
const app = express()
const dotenv = require('dotenv').config()
const bodyParser = require('body-parser')
const validURL = require('valid-url')
const port = process.env.PORT || 3000
const utils = require('./serverUtils.js')
const db = require('./db.js')

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('client'))

app.get('/storage', function (req, res) {
  let id = req.query.id
  // Verify ID is of valid format (only numbers, no leading zeros)
  if (utils.verifyID(id)) {
    // Initiate DB check and response
    db.checkJob(res, id)
  } else {
    // Respond with invalid ID
    res.send(`<html><body><h1>Sorry, we were unable to process your request. Please check your job number and try again. Refresh to try again.</h1></body></html>`)
  }
})

app.post('/storage', function (req, res) {
  let url = req.body.url
  // Check url before inserting into DB
  if (validURL.isHttpUri(url) || validURL.isHttpsUri(url)) {
    // Insert url into database, send response
    db.queueJob(res, url)
  } else {
    // Send error response
    res.send(`<html><body><h1>Sorry, we were unable to process your request. Please check your URL and try again. Refresh to try again.</h1></body></html>`)
  }
})

app.listen(port, function () {
  console.log('Server listening on', port)
})

// Initiate processing of queue
setInterval(db.processQueue, 600000)
