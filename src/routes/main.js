const {parseTemplate} = require('../lib/helpers')

const handler = (req, cb) => {
  parseTemplate('index', {title: 'asd'})
    .then((page) => cb({
      status: 200,
      payload: page,
      type: 'text/html'
    }))
}


module.exports = handler