const validURL = require('valid-url')

// Server utility functions go here

module.exports.verifyID = function (id) {
  // Ensure ID is in correct format
  // Check for non-digit characters
  let matches = id.match(/\D+/g)
  if (matches && matches.length > 0) {
    return false
  }
  // Check for leading zeroes
  let leadZero = id.match(/^0+/g)
  if (leadZero && leadZero.length > 0) {
    return false
  }
  return true
}

module.exports.verifyURL = function (url) {
  return validURL.isHttpUri(url) || validURL.isHttpsUri(url)
}
