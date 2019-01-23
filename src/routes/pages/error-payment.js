const {wrapPage} = require('../../lib/helpers')

const handler = (req, cb) => {
  wrapPage('errorPayment', {head: {title: 'Payment error'}, body: {class: 'payment-error'}})
    .then((page) => {
      cb({
        status: 200,
        payload: page,
        type: 'text/html'
      })
    })
}


module.exports = handler