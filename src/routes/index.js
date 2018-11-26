const users = require('./user')
const session = require('./session')
const products = require('./product')
const cart = require('./cart')
const orders = require('./order')
const {NotFoundError} = require('../lib/response')

const notFound = (data, cb) => {
  cb(new NotFoundError())
}


module.exports = {
  notFound,
  users,
  session,
  products,
  cart,
  orders
}