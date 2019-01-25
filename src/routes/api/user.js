/**
 * users handlers
 */

const db = require('../../lib/db')
const {hash, parseToken} = require('../../lib/helpers')
const validator = require('../../lib/validator')
const f = require('../../lib/functions')
const {NotFoundError, ValidationError, OkResponse} = require('../../lib/response')
const log = require('util').debuglog('users')


// users route container
const users = {}

//creates users
users.post = (req, cb) => {

  //validate required fields
  const valid = validator.validate({
    email: [validator.notBlank],
    name: [validator.notBlank],
    password: [validator.notBlank],
    address: [validator.notBlank],
    username: [validator.notBlank],
  }, req.body)

  if (!valid) {
    cb(new ValidationError())
  } else {
    //check if username exists
    db.users.getUsers()
      .then(users => {
        users = f.filter(f.propEq('username', req.body.username), users)

        if (users.length) {
          cb(new ValidationError('username must be unique'))
        } else {
          return db.users.createUser(f.assoc('created_at', Date.now(), req.body))
            .then((user) => cb(new OkResponse(f.dissoc('password', user))))
        }
      })
      .catch(e => {
        log(e.originError)
        cb(e)
      })
  }
}


//update user's data by id
users.put = (req, cb) => {
  //parse token
  const token = parseToken(req.headers.authorization)

  db.session.readToken(token)
    .then(({userId}) => db.users.getUser(userId))
    .then(({id}) => {
      // validate all existing fields from request
      const schema = Object.keys(req.body).reduce((acc, key) => {
        return f.assoc(key, [validator.notBlank], acc)
      }, {})
      const valid = validator.validate(schema, req.body)

      if (!valid) {
        cb(new ValidationError())
      } else {
        //hash password if changed
        const user = req.body.password
          ? f.assoc('password', hash(req.body.password), req.body)
          : req.body
        //update data and return user without password
        return db.users.updateUser(f.assoc('id', id, user))
          .then(() => cb(new OkResponse(f.dissoc('password', user))))
      }
    })
    .catch((e) => {
      log(e.originError)
      cb(e)
    })
}

//delete user
users.delete = (req, cb) => {

  //parse token
  const token = parseToken(req.headers.authorization)

  db.session.readToken(token)
    .then(({userId}) => db.users.getUser(userId))
    .then(user => {
      return Promise.all((user.sessions || []).map(db.session.removeSession))
        .then(() => user.id)
        .catch(() => user.id)
    })
    .then(db.users.removeUser)
    .then(() => cb(new OkResponse()))
    .catch(e => {
      log(e.originError)
      cb(e)
    })
}

//get user info
users.get = (req, cb) => {
  //parse token
  const token = parseToken(req.headers.authorization)
  db.session.readToken(token)
    .then(({userId}) => db.users.getUser(userId))
    .then(user => cb(new OkResponse(f.dissoc('password', user))))
    .catch(e => cb(e))
}



// routing function for users routes
module.exports = (req, cb) => {
  const handler = users[req.method] || ((req, cb) => cb(new NotFoundError()))
  handler(req, cb)
}