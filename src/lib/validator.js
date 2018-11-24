const isString = (x) => typeof x === "string" && !!x.trim()
const notNull = (x) => x !== null && x !== undefined
const notBlank = (x) => typeof x === "string" ? isString(x) : notNull(x)
const lengthEqual = (length) => (x) => x.length === length
const lengthGte = (length) => (x) => x.length > length

const validate = (schema, data) => {
  return Object.keys(schema).every(field => {
    return schema[field].every(fn => fn(data[field]))
  })
}

module.exports = {
  validate,
  isString,
  notNull,
  lengthEqual,
  lengthGte,
  notBlank
}