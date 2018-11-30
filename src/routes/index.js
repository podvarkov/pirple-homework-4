//api routes
const users = require('./user')
const session = require('./session')
const products = require('./product')
const cart = require('./cart')
const orders = require('./order')

//html pages routes
const main = require('./main')
const _public = require('./public')

const {NotFoundError} = require('../lib/response')

const notFound = (data, cb) => {
  cb(new NotFoundError())
}


module.exports = {
  notFound,
  'api/users': users,
  'api/session':session,
  'api/products':products,
  'api/cart':cart,
  'api/orders':orders,
  '': main,
  public: _public
}

//TODO static assets, index.html