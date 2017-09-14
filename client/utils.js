function checkStatus () {
  var input = document.getElementById('idInput').value
  var xhr = new XMLHttpRequest()
  var url = '/storage?id=' + input
  xhr.open('GET', url)
  xhr.onload = function () {
    if (xhr.status === 200) {
      console.log('Request successful')
      var refresh = document.open('text/html', 'replace')
      refresh.write(xhr.responseText)
      refresh.close()
    } else {
      console.log('Request failed')
    }
  }
  xhr.send()
}

function requestCache () {
  var input = document.getElementById('reqURL').value
  var xhr = new XMLHttpRequest()
  var url = '/storage'
  xhr.open('POST', url)
  xhr.onload = function () {
    if (xhr.status === 200) {
      console.log('Request successful')
      var refresh = document.open('text/html', 'replace')
      refresh.write(xhr.responseText)
      refresh.close()
    } else {
      console.log('Request failed')
    }
  }
  xhr.send()
}
