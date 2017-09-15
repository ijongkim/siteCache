const request = require('request')
const promise = require('bluebird')
const options = { promiseLib: promise }
const pgp = require('pg-promise')(options)
const db = pgp(process.env.DB_URL)

// DB functions go here

module.exports.checkJob = function (res, id) {
  // Query DB to see if job id exists
  db.oneOrNone(`SELECT id, processed, url, cache FROM queue WHERE id = '${id}';`)
  .then(results => {
    // If query is successful, check for results
    if (results) {
      // If data was returned, check to see if it's been processed
      if (results.processed) {
        // If they have been, send the cached html
        res.send(results.cache)
      } else {
        // Else send a response that it's still processing
        res.send(`<html><body><h1>Job #${id} is still processing. You requested "${results.url}", please check back later. Refresh to try again.</h1><h2></h2></body></html>`)
      }
    } else {
      res.send(`<html><body><h1>Sorry, we were unable to process your request. Please check your job number and try again. Refresh to try again.</h1></body></html>`)
    }
  })
  .catch(error => {
    // If an error occurs, notify the user
    console.log('ERROR', error)
    res.send(`<html><body><h1>Sorry, we were unable to process your request. We apologize for the inconvenience, please try again later. Refresh to try again.</h1></body></html>`)
  })
}

module.exports.queueJob = function (res, url) {
  request({url: url, method: 'HEAD'}, function (error, response) {
    if (error) {
      // There was an error, notify user
      console.log('ERROR', error)
      res.send(`<html><body><h1>Sorry, we were unable to process your request. We apologize for the inconvenience, please try again later. Refresh to try again.</h1></body></html>`)
    } else {
      if (response.statusCode === 200) {
        // Insert URL into DB and return job number
        db.one(`INSERT INTO queue (url) VALUES ($1) RETURNING id`, [url])
        .then(results => {
          // Insert was successful, respond with job number
          res.send(`<html><body><h1>Your request was successfully processed. Your job number is ${results.id}. Please save your job number to retrieve your cached result. Refresh to make another request.</h1></body></html>`)
        })
        .catch(error => {
          // There was an error, notify user
          console.log('ERROR', error)
          res.send(`<html><body><h1>Sorry, we were unable to process your request. We apologize for the inconvenience, please try again later. Refresh to try again.</h1></body></html>`)
        })
      } else {
        // URL wasn't valid or up at the time, notify user
        console.log(response.statusCode)
        res.send(`<html><body><h1>Sorry, we were unable to process your request. Please check your URL and try again. Refresh to try again.</h1></body></html>`)
      }
    }
  })
}

module.exports.processQueue = function (freq) {
  console.log('Processing Queue...')
  // Query DB for URLs to process
  db.manyOrNone(`SELECT id, url FROM queue WHERE processed = 'f';`)
  .then(results => {
    console.log(results.length, 'URLs to process')
    results.forEach(function (data) {
      // Make GET request to each URL
      request({url: data.url}, function (error, response, body) {
        if (error) {
          console.log('ERROR', error)
        } else {
          // If request is good
          if (response.statusCode === 200) {
            // Store body in DB
            db.none(`UPDATE queue SET processed = $1, cache = $2 WHERE id = $3`, [true, body, data.id])
          }
        }
      })
    })
  })
  .catch(error => {
    // There was an error, log it
    console.log('ERROR', error)
  })
}
