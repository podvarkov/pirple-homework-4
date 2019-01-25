const crypto = require('crypto')
const config = require('./config')
const fs = require('fs')
const read = require('util').promisify(fs.readFile)
const path = require('path')
const f = require('./functions')

//uuid v4 implementation
const uuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
  const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8)
  return v.toString(16)
})

//safe JSON.parse
const safeParse = (data) => {
  try {
    return JSON.parse(data)
  } catch (e) {
    return {}
  }
}

// Create a SHA256 hash
const hash = function (str) {
  if (typeof(str) === 'string' && str.length > 0) {
    return crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex')
  } else {
    return false
  }
}

//check token helper
const parseToken = (token) => token ? token.replace('Bearer ', '') : null

const interpolate = (page, vars) => {
  vars = f.assoc('global', config.global, vars)
  return page.replace(/{([^}]*)}/g, (_, key) => {
    return f.path(key.split('.'), vars)
  })
}

//parse template
const parseTemplate = async (name, variables = {}) => {

  const page = await read(path.format({
    dir: config.templates,
    name,
    ext: '.html'
  }), 'utf-8')
  return interpolate(page, variables)
}

const wrapPage = async (name, vars = {}) => {
  return `${await parseTemplate('_header', vars)}${await parseTemplate(name, vars)}${await parseTemplate('_footer', vars)}`
}

const getAssets = async _path => {
  return await read(path.join(__dirname, '../..', _path))
}

module.exports = {
  safeParse,
  uuid,
  hash,
  parseToken,
  parseTemplate,
  wrapPage,
  getAssets,
}