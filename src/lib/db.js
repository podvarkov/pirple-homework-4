/**
 * file db library
 */

const fs = require('fs')
const path = require('path')
const util = require('util')
const {uuid, hash} = require('./helpers')
const f = require('./functions')
const {promisify} = util
const _read = promisify(fs.readFile)
const _create = promisify(fs.writeFile)
const _remove = promisify(fs.unlink)
const _list = promisify(fs.readdir)
const BASE_DIR = path.join(__dirname, '../../.data')

const getFullPath = (dir, name) => `${path.join(BASE_DIR, dir, name)  }.json`
const {NotAuthorizedError, InternalError, BadRequestError} = require('../lib/response')

//creates file with specified name in specified dir
const create = (dir, name, data) => _create(getFullPath(dir, name), JSON.stringify(data), 'utf-8')

//reads file with specified name in specified dir, return JSON parsed object
const read = (dir, name) => _read(getFullPath(dir, name), 'utf-8').then(JSON.parse)

//removes file with specified name in specified dir
const remove = (dir, name) => _remove(getFullPath(dir, name))

//merges exists data with given object
const update = async (dir, name, data) => {
  const file = await read(dir, name)
  return create(dir, name, f.merge(file, data))
}

//returns all files in specified dir
const list = (dir) => _list(path.join(BASE_DIR, dir))

//returns all files content in specified dir
const getAll = async (dir) => {
  const files = await list(dir)
  const content = files.map(async (name) => await read(dir, name.replace('.json', '')))
  return Promise.all(content)
}

//users helpers
const createUser = (user) => {
  const id = uuid()
  //add uuid
  user = f.assoc('id', id, user)
  //hash password
  user = f.assoc('password', hash(user.password), user)
  return create('users', id, user)
    .then(() => user)
    .catch(e => {
      throw new InternalError('cant create user', e)
    })
}

const getUser = (id) => read('users', id)
const getUserByEmail = (email) => getUsers().then(f.filter(f.propEq('email', email)))

const updateUser = (user) => update('users', user.id, user)
  .catch(e => {
    throw new InternalError('cant update user', e)
  })

const removeUser = (id) => remove('users', id)
  .catch(e => {
    throw new InternalError('cant remove user', e)
  })

const getUsers = () => getAll('users')

//session helpers
const createSession = async (user) => {
  const token = uuid()
  await create('sessions', token, {userId: user.id})
  const sessions = (user.sessions || []).concat(token)
  await updateUser(f.assoc('sessions', sessions, user))
  return token
}

const removeSession = id => remove('sessions', id).catch(e => {
  throw new InternalError('cant remove session', e)
})

const readToken = (token) => {
  if (!token) return Promise.reject(new NotAuthorizedError())
  return read('sessions', token).catch(() => {
    throw new NotAuthorizedError()
  })
}


//products helpers
const getProducts = () => getAll('products')
const getProduct = (id) => read('products', id).catch(() => {
  throw new BadRequestError('Product not found')
})

//cart helpers
const getCart = (userId) => read('carts', userId).catch(() => [])

const addToCart = async (userId, productId) => {
  if (!productId) throw new BadRequestError('Product not found')
  const product = await getProduct(productId)
  const cart = await getCart(userId)
  return create('carts', userId, [...cart, product])
    .catch(e => {
      throw new InternalError('cant add to cart', e)
    })
}

const removeFromCart = async (userId, productId) => {
  if (!productId) throw new BadRequestError('Product not found')
  let cart = await getCart(userId)
  cart = f.remove(f.propEq('id', productId), cart)
  return create('carts', userId, cart)
    .catch(e => {
      throw new InternalError('cant update from cart', e)
    })
}

const clearCart = (userId) => create('carts', userId, [])
  .catch(e => {
    throw new InternalError('cant clear cart', e)
  })

//orders helpers
const getAllOrders = () => getAll('orders')
  .then(f.flatten)
  .catch(() => [])

const getOrders = (userId) => read('orders', userId).catch(() => [])

const createOrder = async (userId, order) => {
  const orders = await getOrders(userId)
  return create('orders', userId, [...orders, order])
    .catch(e => {
      throw new InternalError('cant save order', e)
    })
}

module.exports = {
  create,
  users: {
    createUser,
    getUser,
    getUserByEmail,
    getUsers,
    removeUser,
    updateUser
  },
  session: {
    createSession,
    readToken,
    removeSession
  },
  products: {
    getProducts
  },
  cart: {
    getCart,
    addToCart,
    removeFromCart,
    clearCart
  },
  orders: {
    createOrder,
    getOrders,
    getAllOrders
  }
}