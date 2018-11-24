/**
 * tokens handlers
 */

const db = require('../lib/db')
const f = require('../lib/functions')
const {hash} = require('../lib/helpers')
const validator = require('../lib/validator')
const {parseToken} = require("../lib/helpers")
const log = require('util').debuglog('session')
const {NotFoundError, ValidationError, OkResponse} = require('../lib/response')


// session route container
let session = {};

//create auth token
session.post = (req, cb) => {
  //validate fields
  const valid = validator.validate({
    password: [validator.notNull],
    username: [validator.isString, validator.notNull],
  }, req.body)

  if (!valid) {
    cb(new ValidationError())
  } else {
    //find requested user
    db.users.getUsers()
      .then(users => {
        //hash password to check
        const requestPassword = hash(req.body.password)
        users = users.filter(user => {
          return user.username === req.body.username && requestPassword === user.password;
        })
        if (users.length) {
          db.session.createSession(f.first(users))
            .then(token => cb(new OkResponse({token})))
        } else {
          cb(new ValidationError("User must exist"))
        }
      })
      .catch((e) => {
        log(e)
        cb(e)
      })
  }
}

session.delete = (req, cb) => {
  const token = parseToken(req.headers.authorization)

  db.session.readToken(token)
    .then(({userId}) => {
      return db.session.removeSession(token).then(() => userId)
    })
    .then(db.users.getUser)
    .then(user => {
      user.sessions = f.remove(f.equal(token), user.sessions)
      return db.users.updateUser(user)
    })
    .then(() => cb(new OkResponse({token})))
    .catch(e => {
      cb(e)
    })
}

// routing function for tokens routes
module.exports = (req, cb) => {
  const handler = session[req.method] || ((req, cb) => cb(new NotFoundError()))
  handler(req, cb)
}


