/**
 * Stripe API integration
 * */

const qs = require('querystring')
const {key, domain, from} = require('./config').mailgun
const {EmailError} = require('./response')
const request = require('./request')
const {assoc} = require('./functions')

const options = {
  hostname: 'api.mailgun.net',
  path: `/v3/${domain}/messages`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': `Basic ${new Buffer(`api:${key}`, 'utf8').toString('base64')}`
  }
}

/**
 * @param mail
 * @param {string} mail.to
 * @param {string} mail.subject
 * @param {string} mail.text
 */
const sendEmail = mail => {
  return request(options, qs.stringify(assoc('from', from, mail)))
    .catch(e => {
      throw new EmailError(e.body.message)
    })
}

module.exports = {
  sendEmail
}