const {wrapPage} = require('../../lib/helpers')

const handler = (req, cb) => {
  wrapPage('accountDeleted', {head: {title: 'Account Deleted'}, body: {class: 'account-deleted'}})
    .then((page) => {
      cb({
        status: 200,
        payload: page,
        type: 'text/html'
      })
    })
}


module.exports = handler