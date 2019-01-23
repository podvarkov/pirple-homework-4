const {getAssets} = require('../lib/helpers')
const path = require('path')

const handler = (req, cb) => {
  let type
  switch (path.extname(req.path)) {
    case '.ico':
      type = 'image/x-icon'
      break
    case '.jpeg':
      type = 'image/jpeg'
      break
    case '.png':
      type = 'image/png'
      break
    case '.css':
      type = 'text/css'
      break
    case '.js':
      type = 'text/javascript'
      break
    default:
      type = 'text/plain'
  }

  getAssets(req.path)
    .then(asset => {
      cb({status: 200, payload: asset, type})
    })
    .catch(() => cb({status: 404, type}))
}


module.exports = handler