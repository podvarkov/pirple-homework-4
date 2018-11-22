const {notFound} = require('./index')

// users route container
let users = {};

users.get = (req, cb) => cb(200, {users: "GET"})
users.post = (req, cb) => cb(200, {users: "POST"})
users.put = (req, cb) => cb(200, {users: "PUT"})
users.delete = (req, cb) => cb(200, {users: "DELETE"})

// routing function for users routes
module.exports = (req, cb) => {
  const handler = users[req.method] || notFound
  handler(req, cb)
}