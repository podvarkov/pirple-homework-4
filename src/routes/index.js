const _public = require('./public')
const api = require('./api')
const main = require('./pages/main')
const createAccount = require('./pages/create-account')
const createSession = require('./pages/create-session')

module.exports = {
  '': main,
  'account/create': createAccount,
  'session/create': createSession,
  public: _public,
  api,
  notFound: (_, cb) => cb({status:404})
}