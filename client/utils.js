function checkStatus () {
  // Get value from input
  var input = document.getElementById('idInput').value
  // Create new XMLHttpRequest
  var xhr = new XMLHttpRequest()
  // Define endpoint and options
  var url = `/storage?id=${input}`
  xhr.open('GET', url)
  // Define how to handle response
  xhr.onload = function () {
    // If request returns a good response
    if (xhr.status === 200) {
      // Render returned HTML into document
      var doc = document.open('text/html', 'replace')
      doc.write(xhr.responseText)
      doc.close()
    } else {
      // Else log error
      // Ideally we notify user of the error
      console.log(`Request for job number "${input}" failed`)
    }
  }
  // Send request
  xhr.send()
}

function requestCache () {
  // Get value from input
  var input = document.getElementById('reqURL').value
  // Create new XMLHttpRequest
  var xhr = new XMLHttpRequest()
  // Define endpoint and options
  var url = '/storage'
  xhr.open('POST', url)
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
  // Define how to handle response
  xhr.onload = function () {
    // If request returns a good response
    if (xhr.status === 200) {
      // Render returned HTML into document
      var doc = document.open('text/html', 'replace')
      doc.write(xhr.responseText)
      doc.close()
    } else {
      // Else log error
      // Ideally we notify user of the error
      console.log('Request failed')
    }
  }
  // Send request
  xhr.send(encodeURI('url=' + input))
}
