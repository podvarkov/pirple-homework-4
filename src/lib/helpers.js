const crypto = require('crypto');
const config = require('./config')

//uuid v4 implementation
const uuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
  const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
  return v.toString(16);
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
hash = function(str){
  if(typeof(str) === 'string' && str.length > 0){
    return crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
  } else {
    return false;
  }
};

//helper functions
const f = {
  assoc: (key, data, obj) => ({...obj, [key]: data}),
  prop: (key, data) => data[key],
  merge: (o1, o2) => ({...o1, ...o2}),
  identity: (x) => x,
  not: (fn) => (x) => !fn(x),
  dissoc: (key, data) => {
    const newData = {...data}
    delete newData[key]
    return newData
  },
  pick: (keys, data) =>
    keys.reduce((acc, el) => f.assoc(el, f.prop(el, data), acc), {})
}


const validator = {
  existenseOf: (key, msg) => (data) => {
    if (typeof data[key] !== "undefined" && data[key] !== null) {
      if (typeof data[key] === "string" && !!data[key].trim()) {
        return null
      } else {
        if (!!data[key]) {
          return null
        }
      }
    }
    return {[key]: msg || "cant be blank"}
  },
  validationSet: (...fns) => data => {
    return fns.map(fn => fn(data)).filter(f.identity)
  }
}

module.exports = {
  safeParse,
  uuid,
  hash,
  f,
  validator
}