const http = require('http');
const config = require('./lib/config');
const handler = require('./lib/server-handler');
const server = http.createServer(handler);

server.listen(config.port, () => {
  console.log(config.envName + ' http server listening on port', config.port)
});