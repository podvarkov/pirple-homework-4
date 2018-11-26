/**
 * user cart handlers
 */

const db = require('../lib/db')
const f = require('../lib/functions')
const {parseToken} = require('../lib/helpers')
const {NotFoundError, OkResponse} = require('../lib/response')
const log = require('util').debuglog('cart')


// cart route container
const cart = {}

//get user's cart
cart.get = (req, cb) => {
  //parse token
  const token = parseToken(req.headers.authorization)
  db.session.readToken(token)
    .then(({userId}) => db.cart.getCart(userId))
    .then(cart => cb(new OkResponse({cart})))
    .catch(e => cb(e))
}

//add product to cart
cart.post = (req, cb) => {
  //get product id
  const productId = f.prop('productId', req.queryParams)
  //parse token
  const token = parseToken(req.headers.authorization)

  db.session.readToken(token)
    .then(({userId}) => db.cart.addToCart(userId, productId))
    .then(() => cb(new OkResponse({id: productId})))
    .catch(e => {
      log(e)
      cb(e)
    })
}

//remove product from cart by id
cart.delete = (req, cb) => {
  //get product id
  const productId = f.prop('productId', req.queryParams)
  //parse token
  const token = parseToken(req.headers.authorization)
  db.session.readToken(token)
    .then(({userId}) => db.cart.removeFromCart(userId, productId))
    .then(() => cb(new OkResponse({id: productId})))
    .catch(e => cb(e))
}

// routing function for users routes
module.exports = (req, cb) => {
  const handler = cart[req.method] || ((req, cb) => cb(new NotFoundError()))
  handler(req, cb)
}
