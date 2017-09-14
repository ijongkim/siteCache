const promise = require('bluebird')
const options = { promiseLib: promise }
const pgp = require('pg-promise')(options)
const db = pgp(process.env.DB_URL)
// DB functions go here

module.exports.checkJob = function (res, id) {
  // Query DB to see if job id exists
  return db.oneOrNone(`SELECT id, processed, url, cache FROM queue WHERE id = '${id}';`)
  .then(results => {
    if (results) {
      if (results.processed) {
        res.send(results.cache)
      } else {
        res.send(`<html><body><h1>Job #${id} is still processing. Please check back later.</h1></body></html>`)
      }
    }
  })
  .catch(error => {
    res.send(`<html><body><h1>Sorry, we were unable to process your request. We apologize for the inconvenience, please try again later.</h1></body></html>`)
  })
}

module.exports.queueJob = function (url) {
  // Insert URL into DB and return job number
  return -1
}
