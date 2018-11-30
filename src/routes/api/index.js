const path = require('path')
const users = require('./user')
const cart = require('./cart')
const products = require('./cart')
const session = require('./session')
const orders = require('./order')

const handlers = {
  users,
  cart,
  products,
  session,
  orders
}

const router = (req, cb) => {
  const handler = handlers[path.basename(req.path)] || ((_, cb) => cb({status:404}))
  handler(req, cb)
}

module.exports = router