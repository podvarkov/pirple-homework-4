const {wrapPage} = require('../../lib/helpers')

const handler = (req, cb) => {
  wrapPage('cart', {head: {title: 'Cart'}, body: {class: 'user-cart'}})
    .then((page) => cb({
      status: 200,
      payload: page,
      type: 'text/html'
    }))
    .catch(() => {
      cb({status: 500})
    })
}

module.exports = handler