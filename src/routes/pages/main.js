const {wrapPage} = require('../../lib/helpers')

const handler = (req, cb) => {
  wrapPage('index', {head: {title: 'main'}, body: {class: 'index'}})
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