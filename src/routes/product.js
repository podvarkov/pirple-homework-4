/**
 * products handlers
 */

const db = require('../lib/db')
const f = require('../lib/functions')
const {parseToken} = require("../lib/helpers")
const {NotFoundError,OkResponse} = require('../lib/response')
const log = require('util').debuglog('products')


// users route container
let products = {};

//get all products
products.get = (req, cb) => {
  //parse token
  const token = parseToken(req.headers.authorization)
  db.session.readToken(token)
    .then(() => db.products.getProducts())
    .then(products => cb(new OkResponse({products})))
    .catch(e => cb(e))
}

// routing function for users routes
module.exports = (req, cb) => {
  const handler = products[req.method] || ((req, cb) => cb(new NotFoundError()))
  handler(req, cb)
}
