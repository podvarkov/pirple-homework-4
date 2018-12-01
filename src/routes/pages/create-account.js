const {wrapPage} = require('../../lib/helpers')

const handler = (req, cb) => {
  wrapPage('accountCreate', {head: {title: 'Create Account'}, body: {class: 'index'}})
    .then((page) => {
      cb({
        status: 200,
        payload: page,
        type: 'text/html'
      })
    })
}


module.exports = handler