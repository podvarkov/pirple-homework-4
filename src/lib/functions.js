//helper functions
const _curry = (fn) => {
  const arity = fn.length
  return function c(...args) {
    return args.length < arity ? c.bind(null, ...args) : fn(...args)
  }
}

const pipe = (...fns) => (arg) => fns.reduce((acc, fn) => fn(acc), arg)
const assoc = (key, data, obj) => ({...obj, [key]: data})
const prop = (key, data) => data[key]
const merge = (o1, o2) => ({...o1, ...o2})
const identity = (x) => x
const not = (x) => !x
const complement = (fn) => (...args) => !fn(...args)
const first = (list) => list[0]
const pick = (keys, data) => keys.reduce((acc, el) => f.assoc(el, f.prop(el, data), acc), {})
const dissoc = (key, data) => {
  const newData = {...data}
  delete newData[key]
  return newData
}
const filter = (pred, data) => data.filter(pred)
const remove = (pred, data) => data.filter(complement(pred))
const equal = (x1, x2) => x1 === x2
const propEq = (key, value, obj) => prop(key, obj) === value

module.exports = {
  pipe,
  identity,
  complement,
  first,
  assoc: _curry(assoc),
  prop: _curry(prop),
  merge: _curry(merge),
  pick: _curry(pick),
  dissoc: _curry(dissoc),
  filter: _curry(filter),
  remove: _curry(remove),
  propEq: _curry(propEq),
  equal: _curry(equal)
}