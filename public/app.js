/* eslint-disable */
var request = function (params, success, err) {
  const xhr = new XMLHttpRequest()

  xhr.onload = xhr.onerror = function () {
    if (xhr.status === 200) {
      success(xhr.response)
    } else {
      err(xhr.response)
    }
  }

  xhr.open(params.method, params.url)
  if (params.headers) {
    for (var i = 0; i<params.headers.length; i++) {
      console.log(params.headers[i])
      xhr.setRequestHeader(params.headers[i][0], params.headers[i][1])
    }
  }

  xhr.responseType = 'json'
  xhr.send(JSON.stringify(params.body))
}

var app = {}
app.createAccount = function(form) {
  var formError = document.querySelector('.formError')
  formError.style.display = 'none'

  var params = {
    url: form.action,
    method: form.method,
    body: {
      name: form.elements['firstName'].value + " " + form.elements['lastName'].value,
      username: form.elements['userName'].value,
      password: form.elements['password'].value,
      email: form.elements['email'].value,
      address: form.elements['address'].value,
    }
  }

  request(params, function(){
    window.location.href = "/"
  }, function (err) {
    console.error(err)
    formError.innerText = err.message
    formError.style.display = 'block'
  })
}

document.addEventListener('submit', function (e) {
  e.preventDefault()
  switch (e.target.id) {
    case 'accountCreate':
      return app.createAccount(e.target)
  }
})