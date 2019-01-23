const _public = require('./public')
const api = require('./api')
const main = require('./pages/main')
const createAccount = require('./pages/create-account')
const editAccount = require('./pages/edit-account')
const accountDeleted = require('./pages/account-deleted')
const createSession = require('./pages/create-session')
const products = require('./pages/products')
const userCart = require('./pages/user-cart')
const successPayment = require('./pages/success-payment')
const errorPayment = require('./pages/error-payment')

module.exports = {
  '': main,
  'account/create': createAccount,
  'account/edit': editAccount,
  'account/deleted': accountDeleted,
  'session/create': createSession,
  'products': products,
  'user/cart': userCart,
  'payment/success': successPayment,
  'payment/error': errorPayment,
  public: _public,
  api,
  notFound: (_, cb) => cb({status:404})
}