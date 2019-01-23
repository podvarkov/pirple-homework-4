const url = require('url')
const {StringDecoder} = require('string_decoder')
const routes = require('../routes')
const {safeParse} = require('./helpers')

const serverHandler = (req, res) => {
  const parsedUrl = url.parse(req.url, true)
  const path = parsedUrl.pathname.replace(/^\/+|\/+$/g, '')
  const method = req.method.toLowerCase()
  const queryParams = parsedUrl.query
  const {headers} = req

  let buffer = ''
  const decoder = new StringDecoder('utf-8')

  req.on('data', (data) => {
    buffer += decoder.write(data)
  })

  req.on('end', () => {
    buffer += decoder.end()
    const req = {
      path,
      method,
      queryParams,
      headers,
      body: safeParse(buffer)
    }

    let chosenRoute = routes[path] || routes.notFound

    if (path.split('/')[0] === 'public') {
      chosenRoute = routes['public']
    }

    if (path.split('/')[0] === 'api') {
      chosenRoute = routes['api']
    }

    chosenRoute(req, (response) => {
      if (response.redirect) {
        res.writeHeader(302, {Location: response.redirect})
        res.end()
      } else {
        res.setHeader('Content-Type', response.type || 'text/plain')
        res.writeHeader(response.status)
        res.end(response.payload)
      }
    })
  })
}

module.exports = serverHandler
