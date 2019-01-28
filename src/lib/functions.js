//helper functions
const _curry = (fn) => {
  const arity = fn.length
  return function c(...args) {
    return args.length < arity ? c.bind(null, ...args) : fn(...args)
  }
}

const assoc = (key, data, obj) => ({...obj, [key]: data})
const prop = (key, data) => data[key]
const merge = (o1, o2) => ({...o1, ...o2})
const complement = (fn) => (...args) => !fn(...args)
const first = (list) => list[0]
const pick = (keys, data) => keys.reduce((acc, el) => assoc(el, prop(el, data), acc), {})
const dissoc = (key, data) => {
  const newData = {...data}
  delete newData[key]
  return newData
}
const filter = (pred, data) => data.filter(pred)
const remove = (pred, data) => data.filter(complement(pred))
const equal = (x1, x2) => x1 === x2
const propEq = (key, value, obj) => prop(key, obj) === value
const add = (x1, x2) => x1 + x2
const path = (path, value) => path.reduce((acc, el) => acc ? acc[el] : undefined, value)
const toPairs = obj => Object.entries(obj)
const flatten = (array) => {
  const responce = []
  flat(array)
  return responce

  function flat(a) {
    if (Array.isArray(a)) {
      a.forEach(flat)
    } else {
      responce.push(a)
    }
  }
}


module.exports = {
  first,
  flatten,
  assoc: _curry(assoc),
  prop: _curry(prop),
  merge: _curry(merge),
  pick: _curry(pick),
  dissoc: _curry(dissoc),
  filter: _curry(filter),
  remove: _curry(remove),
  propEq: _curry(propEq),
  equal: _curry(equal),
  add: _curry(add),
  path: _curry(path),
  toPairs
}