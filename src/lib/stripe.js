/**
 * Stripe API integration
 * */

const qs = require('querystring')
const {assoc} = require('./functions')
const {stripeKey} = require('./config')
const {PaymentError} = require('./response')
const request = require('./request')

const defaultOptions = {
  hostname: 'api.stripe.com',
  path: '',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': `Bearer ${stripeKey}`,
  }
}

/**
 * @param charge
 * @param {number} charge.amount
 * @param {string} charge.currency
 * @param {string} [charge.description]
 * @param {string} charge.source - card token
 */
const createCharge = charge => {
  return request(assoc('path', '/v1/charges', defaultOptions), qs.stringify(charge))
    .catch(e => {
      throw new PaymentError(e.message)
    })
}

module.exports = {
  createCharge
}