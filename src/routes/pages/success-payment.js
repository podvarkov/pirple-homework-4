const {wrapPage} = require('../../lib/helpers')

const handler = (req, cb) => {
  wrapPage('successPayment', {head: {title: 'Payment complete'}, body: {class: 'payment-success'}})
    .then((page) => {
      cb({
        status: 200,
        payload: page,
        type: 'text/html'
      })
    })
}


module.exports = handler