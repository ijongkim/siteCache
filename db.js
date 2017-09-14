// DB functions go here
module.exports.checkJob = function (id) {
  // Query DB to see if job id exists
  return `<html><body><h1>Job #${id} is still processing. Please check back later.</h1></body></html>`
}

module.exports.queueJob = function (url) {
  // Insert URL into DB and return job number
  return -1
}
