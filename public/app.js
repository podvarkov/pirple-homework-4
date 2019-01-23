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
    for (var i = 0; i < params.headers.length; i++) {
      xhr.setRequestHeader(params.headers[i][0], params.headers[i][1])
    }
  }

  xhr.responseType = 'json'
  xhr.send(JSON.stringify(params.body))
}

var app = {}
app.createAccount = function (form) {
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

  request(params, function () {
    window.location.href = "/"
  }, function (err) {
    console.error(err)
    formError.innerText = err.message
    formError.style.display = 'block'
  })
}

app.createSession = function (form) {
  var formError = document.querySelector('.formError')
  formError.style.display = 'none'

  var params = {
    url: form.action,
    method: form.method,
    body: {
      username: form.elements['userName'].value,
      password: form.elements['password'].value,
    }
  }

  request(params, function (data) {
    localStorage.setItem('token', data.token)
    window.location.href = '/products'
  }, function (err) {
    console.error(err)
    formError.innerText = err.message
    formError.style.display = 'block'
  })
}

app.editAccount = function (form) {
  var formError = document.querySelector('.formError')
  formError.style.display = 'none'
  var formSuccess = document.querySelector('.formSuccess')
  formError.style.display = 'none'

  var params = {
    headers: [['Authorization', 'Bearer ' + app.sessionToken]],
    url: form.action,
    method: 'PUT',
    body: {
      name: form.elements['firstName'].value + " " + form.elements['lastName'].value,
      email: form.elements['email'].value,
      address: form.elements['address'].value,
    }
  }

  request(params, function () {
    formSuccess.style.display = 'block'
  }, function (err) {
    console.error(err)
    formError.innerText = err.message
    formError.style.display = 'block'
  })
}

app.changePassword = function (form) {
  var formError = document.querySelector('.p_formError')
  formError.style.display = 'none'
  var formSuccess = document.querySelector('.p_formSuccess')
  formError.style.display = 'none'

  var params = {
    headers: [['Authorization', 'Bearer ' + app.sessionToken]],
    url: form.action,
    method: 'PUT',
    body: {
      password: form.elements['password'].value,
    }
  }
  request(params, function () {
    formSuccess.style.display = 'block'
    form.elements['password'].value = ''
  }, function (err) {
    console.error(err)
    formError.innerText = err.message
    formError.style.display = 'block'
  })
}

app.deleteAccount = function (form) {
  var params = {
    headers: [['Authorization', 'Bearer ' + app.sessionToken]],
    url: form.action,
    method: 'DELETE',
  }

  request(params, function () {
    localStorage.removeItem('token')
    window.location.href = '/account/deleted'
  }, function (err) {
    console.error(err)
  })
}

app.createOrder = function (form) {
  var formError = document.querySelector('.formError')
  var formSuccess = document.querySelector('.formSuccess')

  let params = {
    headers: [['Authorization', 'Bearer ' + app.sessionToken]],
    url: form.action,
    method: 'POST',
    body: {
      card: form.elements['card'].value,
      date: form.elements['date'].value,
      cvc: form.elements['cvc'].value,
    }
  }
  request(params, function (data) {
    console.log(data)
    window.location.href="/payment/success"
  }, function (error) {
    console.log(error)
    window.location.href="/payment/error"
  })
}

var checkSession = function () {
  if (localStorage.getItem('token')) {
    document.body.classList.add('loggedIn')
    return localStorage.getItem('token')
  } else {
    document.body.classList.remove('loggedIn')
    return undefined
  }
}

app.checkCart = function (cb) {
  if (!cb) cb = () => false

  if (checkSession()) {
    let params = {
      headers: [['Authorization', 'Bearer ' + app.sessionToken]],
      url: '/api/cart',
      method: 'GET',
    }

    request(params, function (data) {
      document.getElementById('user-cart').querySelector('a').innerText = 'Cart (' + data.cart.length + ')'
      app.userCart = data.cart
      cb()
    }, function (err) {
      console.error(err)
      cb()
    })
  }
}

app.addToCart = function (productId) {
  let params = {
    headers: [['Authorization', 'Bearer ' + app.sessionToken]],
    url: '/api/cart',
    method: 'POST',
    body: {productId}
  }
  request(params, function () {
    app.checkCart()
  }, function (error) {
    console.log(error)
  })
}

app.removeFromCart = function (productId) {
  let params = {
    headers: [['Authorization', 'Bearer ' + app.sessionToken]],
    url: '/api/cart?productId=' + productId,
    method: 'DELETE',
  }
  request(params, function () {
    window.location.reload()
  }, function (error) {
    console.log(error)
  })
}

app.renderUserCart = function () {
  let cart = document.querySelector('.cart-products')
  app.userCart.map(product => {
    cart.appendChild(app.renderProduct(product))
  })
}

app.renderProduct = function (product) {
  let root = document.createElement('div');
  root.classList.add('pizza-wrapper')
  let image = document.createElement('img')
  image.src = "/public/logo.png";
  image.width = "100";
  root.appendChild(image)

  let description = document.createElement('div')
  description.classList.add('description')

  let name = document.createElement('div')
  name.classList.add('name')
  name.innerText = product.name
  description.appendChild(name)

  let price = document.createElement('div')
  price.classList.add('price')
  price.innerText = product.price + " " + product.currency
  description.appendChild(price)

  let remove = document.createElement('div')
  remove.classList.add('remove-product')
  remove.innerText = 'Remove from cart'
  remove.addEventListener('click', function () {
    app.removeFromCart(product.id)
  })
  description.appendChild(remove)

  root.appendChild(description)

  return root
}

setFormListeners = function () {
  document.addEventListener('submit', function (e) {
    e.preventDefault()
    switch (e.target.id) {
      case 'accountCreate':
        return app.createAccount(e.target)
      case 'sessionCreate':
        return app.createSession(e.target)
      case 'accountEdit1':
        return app.editAccount(e.target)
      case 'accountEdit2':
        return app.changePassword(e.target)
      case 'accountEdit3':
        return app.deleteAccount(e.target)
      case 'payment-form':
        return app.createOrder(e.target)
    }
  })
}

let signUserOut = function () {
  request({
    headers: [['Authorization', 'Bearer ' + app.sessionToken]],
    method: 'DELETE',
    url: '/api/session'
  }, function () {
    localStorage.removeItem('token')
    window.location.href = '/'
  }, function (err) {
    console.log(err.message)
  })
}

let bindLogOut = function () {
  let btn = document.getElementById('logoutButton');
  btn.addEventListener('click', signUserOut)
}

let bindAddToCart = function () {
  let btns = document.querySelectorAll('.add-product');
  btns.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      let productId = e.target.attributes['data-id'].value
      app.addToCart(productId)
    })
  })
}

app.showPaymentForm = function(flag) {
  let form = document.getElementById('payment-wrapper')
  form.classList.remove('invisible')
}


let loadAccountData = function () {
  if (!app.sessionToken) {
    window.location.href = '/'
    return
  }
  request({
    headers: [['Authorization', 'Bearer ' + app.sessionToken]],
    method: 'GET',
    url: '/api/users'
  }, function (data) {
    console.log(data)
    let form = document.getElementById('accountEdit1')
    form.elements['firstName'].value = data.name.split(' ')[0]
    form.elements['lastName'].value = data.name.split(' ')[1]
    form.elements['email'].value = data.email
    form.elements['address'].value = data.address
  }, function (err) {
    console.log(err)
    window.location.href = '/'
  })
}

let loadPageData = function () {
  let className = document.body.className.split(' ')[0]
  app.checkCart(function () {
    switch (className) {
      case 'settings':
        return loadAccountData()
      case 'user-cart': {
        if (app.userCart.length) {app.showPaymentForm(true)}
        app.renderUserCart()
        break
      }
    }
  })
}

window.onload = function () {
  app.sessionToken = checkSession()
  setFormListeners()
  bindLogOut()
  bindAddToCart()
  loadPageData()
}