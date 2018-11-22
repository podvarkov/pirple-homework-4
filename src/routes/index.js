const users = require('./users')

const notFound = (data, cb) => {
  cb(404, {message: "Not found route"})
};


module.exports = {
  notFound,
  users
};