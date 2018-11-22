const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const routes = require('../routes');
const log = require('util').debuglog('server')
const {safeParse} = require('./helpers')

const serverHandler = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');
  const method = req.method.toLowerCase();
  const queryParams = parsedUrl.query;
  const headers = req.headers;

  let buffer = '';
  const decoder = new StringDecoder('utf-8');

  req.on('data', (data) => {
    buffer += decoder.write(data);
  });

  req.on('end', () => {
    buffer += decoder.end();
    const req = {
      path,
      method,
      queryParams,
      headers,
      body: safeParse(buffer)
    };

    const chosenRoute = routes[path] || routes.notFound;

    chosenRoute(req, (status = 200, payload = {}) => {
      log(req)
      res.setHeader('Content-Type', 'application/json');
      res.writeHeader(status);
      res.end(JSON.stringify(payload));
    })
  });
};

module.exports = serverHandler;
