/**
 * file db library
 */

const fs = require('fs');
const path = require('path');
const util = require('util')
const promisify = util.promisify
const _read = promisify(fs.readFile)
const _create = promisify(fs.writeFile)
const _remove = promisify(fs.unlink)
const _list = promisify(fs.readdir)
const {merge} = require('./helpers').f
const BASE_DIR = path.join(__dirname, "../../.data")

const getFullPath = (dir, name) => path.join(BASE_DIR, dir, name) + '.json';
const parse = JSON.parse;
const stringify = JSON.stringify;

//creates file with specified name in specified dir
const create = (dir, name, data) => {
  return _create(getFullPath(dir, name), stringify(data), "utf-8")
}

//reads file with specified name in specified dir, return JSON parsed object
const read = (dir, name) => _read(getFullPath(dir, name), "utf-8").then(parse)

//removes file with specified name in specified dir
const remove = (dir, name) => _remove(getFullPath(dir, name))

//merges exists data with given object
const update = async (dir, name, data) => {
  const file = await read(dir, name)
  return create(dir, name, merge(file, data))
}

//returns all files in specified dir
const list = (dir) => {
  return _list(path.join(BASE_DIR, dir))
}

//returns all files content in specified dir
const getAll = async (dir) => {
  const files = await list(dir)
  const content = files.map(async (name) => await read(dir, name.replace('.json', '')))
  return Promise.all(content)
}


module.exports = {
  remove,
  update,
  read,
  list,
  getAll,
  create
}