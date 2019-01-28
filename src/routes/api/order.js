/**
 * user cart handlers
 */

const db = require('../../lib/db')
const f = require('../../lib/functions')
const {createCharge} = require('../../lib/stripe')
const {parseToken} = require('../../lib/helpers')
const {NotFoundError, OkResponse, BadRequestError} = require('../../lib/response')
const {sendEmail} = require('../../lib/mailgun')
const log = require('util').debuglog('orders')

// orders route container
const orders = {}

//get user's orders
orders.get = (req, cb) => {
  //parse token
  const token = parseToken(req.headers.authorization)
  db.session.readToken(token)
    .then(({userId}) => db.orders.getOrders(userId))
    .then(orders => cb(new OkResponse({orders})))
    .catch(e => cb(e))
}

//create order
orders.post = (req, cb) => {
  //parse token
  const token = parseToken(req.headers.authorization)
  let id = undefined
  let order = undefined

  db.session.readToken(token)
    .then(({userId}) => {
      id = userId
      return db.cart.getCart(userId)
    })
    .then(cart => {
      if (!cart.length) {
        throw new BadRequestError('Cart is empty')
      } else {
        //order to save after paid
        order = {
          cart,
          currency: f.prop('currency', f.first(cart)),
          total: cart.reduce((acc, el) => f.add(el.price, acc), 0) * 100
        }

        //pay with stripe
        return createCharge({
          amount: order.total,
          currency: order.currency,
          source: 'tok_visa',
          description: id
        })
      }
    })
    .then(({body: res}) => {
      order.chargeId = res.id
      order.balanceTransaction = res.balance_transaction
      order.created = res.created * 1000
      order.paid = res.paid
      return db.orders.createOrder(id, order)
    })
    .then(() => cb(new OkResponse(order)))
    .then(() => db.cart.clearCart(id))
    .catch(e => cb(e))
    .then(() => db.users.getUser(id))
    /**
     * THIS BLOCK WILL ALWAYS THROW AN EXCEPTION
     * TILL USING MAILGUN SANDBOX
     */
    .then(({email}) => sendEmail({
      to: email, //or change to your mailgun whitelisted user
      subject: 'Order',
      text: 'Your order was successfully paid'
    }))
    .catch(e => log(e))
}

// routing function for users routes
module.exports = (req, cb) => {
  const handler = orders[req.method] || ((req, cb) => cb(new NotFoundError()))
  handler(req, cb)
}
