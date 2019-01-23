const {wrapPage} = require('../../lib/helpers')

const handler = (req, cb) => {
  wrapPage('accountEdit', {head: {title: 'Account Settings'}, body: {class: 'settings'}})
    .then((page) => {
      cb({
        status: 200,
        payload: page,
        type: 'text/html'
      })
    })
}


module.exports = handler