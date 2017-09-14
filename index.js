const express = require('express')
const app = express()
const dotenv = require('dotenv').config()
const port = process.env.PORT || 3000
const utils = require('./serverUtils.js')
const db = require('./db.js')

app.use(express.static('client'))

app.get('/storage', function (req, res) {
  let id = req.query.id
  // Verify ID is of valid format (all numbers)
  if (utils.verifyID(id)) {
    // Initiate DB check and response
    let response = db.checkJob(id)
    res.send(response)
  }
})

app.post('/storage')

app.listen(port, function () {
  console.log('Server listening on', port)
})
