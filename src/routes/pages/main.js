const {wrapPage} = require('../../lib/helpers')
const {company} = require('../../lib/config')

const handler = (req, cb) => {
  wrapPage('index', {title: 'main', company})
    .then((page) => cb({
      status: 200,
      payload: page,
      type: 'text/html'
    }))
    .catch(() => cb({status: 500}))
}


module.exports = handler