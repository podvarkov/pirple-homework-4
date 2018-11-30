const {wrapPage} = require('../../lib/helpers')
const {company} = require('../../lib/config')

const handler = (req, cb) => {
  wrapPage('accountCreate', {title: 'main', company})
    .then((page) => {
      cb({
        status: 200,
        payload: page,
        type: 'text/html'
      })
    })
}


module.exports = handler