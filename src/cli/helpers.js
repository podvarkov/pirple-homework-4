const {format} = require('util')
const f = require('../lib/functions')

const colors = {
  reset: '\x1b[0m',
  fgBlack: '\x1b[30m',
  fgRed: '\x1b[31m',
  fgGreen: '\x1b[32m',
  fgYellow: '\x1b[33m',
  fgBlue: '\x1b[34m',
  fgMagenta: '\x1b[35m',
  fgCyan: '\x1b[36m',
  fgWhite: '\x1b[37m',
}

const parseArgs = (command, line) => {
  const transform = (array, obj = {}) => {
    if (!array.length) return obj
    const [key, val, ...rest] = array
    obj[key] = val
    return rest.length < 2 ? obj : transform(rest, obj)
  }

  const rawArgs = line.replace(command, '').trim().split(' ')
  return transform(rawArgs)
}

const hLine = (sym) => sym.repeat(process.stdout.columns)

const centered = str => {
  const center = Math.floor(process.stdout.columns / 2)
  const textCenter = Math.floor(str.length / 2)
  return `${' '.repeat(center - textCenter)}${str}`
}

const colorify = (color, str) => {
  return format('%s%s%s', color, str, colors.reset)
}

const objectToMsg = (obj) => f.toPairs(obj).map(([key, value]) => {
  let padding = Math.max(...f.toPairs(obj).map(([key]) => key.length))
  padding = padding + 15 - (key.length)
  return format('%s%s%s\n', colorify(colors.fgMagenta, key), ' '.repeat(padding), value)
}).join('')


module.exports = {
  parseArgs,
  hLine,
  centered,
  colorify,
  objectToMsg,
  colors,
}