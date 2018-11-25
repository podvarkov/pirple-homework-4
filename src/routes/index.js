const users = require('./users')
const session = require('./session')
const products = require('./product')
const cart = require('./cart')
const {NotFoundError} = require('../lib/response')

const notFound = (data, cb) => {
  cb(new NotFoundError())
};


module.exports = {
  notFound,
  users,
  session,
  products,
  cart
};