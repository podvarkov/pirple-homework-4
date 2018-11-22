/**
 * users handlers
 */

//TODO validate via tokens

const {notFound} = require('./index')
const db = require('../lib/db')
const {uuid, f, validator, hash} = require('../lib/helpers')
const log = require('util').debuglog('users')


// users route container
let users = {};

//creates users
users.post = (req, cb) => {
  //check if username exists
  db.getAll('users')
    .then(users => {
      users = users.filter(user => user.username === req.body.username)
      if (users.length) {
        cb(400, {error: "username must be unique"})
      } else {
        //validate required fields
        const errors = validator.validationSet(
          validator.existenseOf('email'),
          validator.existenseOf('name'),
          validator.existenseOf('password'),
          validator.existenseOf('address'),
          validator.existenseOf('username'),
        )(req.body)

        if (errors.length) {
          cb(400, {message: "validation error", errors})
        } else {
          const id = uuid()
          //add uuid
          let user = f.assoc('id', id, req.body)
          //hash password
          user = f.assoc('password', hash(user.password), user)
          db.create('users', id, user)
            .then(() => cb(200, f.dissoc('password', user)))
            .catch(() => cb(500, {error: 'can not create user'}))
        }
      }
    })
    .catch(() => cb(500, {error: "can not read users"}))
}

//returns user info by id in querystring without password
users.get = (req, cb) => {
  db.read('users', req.queryParams.id)
    .then(user => cb(200, f.dissoc('password', user)))
    .catch(() => cb(404, {error: 'user not found'}))
}

//update user's data by id
users.put = (req, cb) => {
  let userInfo = f.dissoc('id', req.body)

  //validate all existing fields except id from request
  const errors = validator.validationSet(
    ...Object.keys(userInfo).map(key => validator.existenseOf(key))
  )(userInfo)

  if (errors.length) {
    cb(400, {message: "validation error", errors})
  } else {
    //hash password if changed
    userInfo = userInfo.password
      ? f.assoc('password', hash(userInfo.password), userInfo)
      : userInfo

    //update data
    db.update('users', req.body.id, userInfo)
      .then(() => cb(200, userInfo))
      .catch((e) => {
        cb(404, {error: 'user not found'})
      })
  }
}

//delete user by id
//TODO delete all relative data
users.delete = (req, cb) => {
  db.remove('users', req.queryParams.id)
    .then(() => cb(200, {id: req.queryParams.id}))
    .catch(() => cb(404, {error: 'user not found'}))
}

// routing function for users routes
module.exports = (req, cb) => {
  const handler = users[req.method] || notFound
  handler(req, cb)
}