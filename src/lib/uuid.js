//Implementation of uuid/v4

module.exports = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
  const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
  return v.toString(16);
})

/**
 * TODO
 * add config
 * init server
 * add files db libriary
 * users handlers POST-new user, PUT?id - edit user, DELETE?id -delete user
 * name, email address, and street address.
 * + some kind of validation
 */

