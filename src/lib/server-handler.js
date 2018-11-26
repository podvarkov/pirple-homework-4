const url = require('url')
const {StringDecoder} = require('string_decoder')
const routes = require('../routes')
const log = require('util').debuglog('server')
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

    const chosenRoute = routes[path] || routes.notFound

    chosenRoute(req, (response) => {
      log(req)
      res.setHeader('Content-Type', 'application/json')
      res.writeHeader(response.status)
      res.end(response.json())
    })
  })
}

module.exports = serverHandler
