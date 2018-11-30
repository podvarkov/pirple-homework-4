const http = require('http')
const config = require('./lib/config')
const handler = require('./lib/server-handler')
const server = http.createServer(handler)
const log = require('util').debuglog('server')

server.listen(config.port, () => {
  log(`${config.envName} http server listening on port`, config.port)
})