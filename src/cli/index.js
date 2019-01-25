/* eslint-disable no-console */
const readline = require('readline')
const {format} = require('util')
const EventEmitter = require('events')
const f = require('../lib/functions')
const {hLine, centered, colorify, parseArgs, colors} = require('./helpers')

class Emitter extends EventEmitter {
}

const emitter = new Emitter()

const commands = [
  {
    command: 'help',
    man: 'See this page'
  },
  {
    command: 'man',
    man: 'See this page'
  },
  {
    command: 'exit',
    man: 'Kill CLI process'
  },
  {
    command: 'menu',
    man: 'View menu items'
  },
  {
    command: 'orders',
    man: 'View all the recent orders in the system (orders placed in the last 24 hours)'
  },
  {
    command: 'order-detail',
    man: 'Lookup the details of a specific order by order ID',
    option: '--id'
  },
  {
    command: 'users',
    man: 'View all the users who have signed up in the last 24 hours'
  },
  {
    command: 'user-detail',
    man: 'Lookup the details of a specific user by email address',
    option: '--id'
  }
]


//responders
const responders = {}

responders.help = () => {
  emitter.emit('man')
}

responders.man = () => {
  let message = commands.reduce((acc, {command, man, option=''}) => {
    let padding = Math.max(...commands.map(({command, option}) => (command+option).length))
    padding = padding + 15 - ((command+option).length)
    acc += format('%s%s%s\n', colorify(colors.fgCyan, [command, option].join(' ')), ' '.repeat(padding), man)
    return acc
  }, '')
  message = format('%s\n%s\n%s%s', centered('CLI manual'), hLine('='), message, hLine('='))
  console.log(message)
}

responders.exit = () => {
  cliInput.emit('close')
}

responders.menu = () => {
  console.log('menu')
}

responders.orders = () => {
  console.log('orders')
}

responders['order-detail'] = () => {
  console.log('order-detail')
}

responders.users = () => {
  console.log('users')
}

responders['user-detail'] = () => {
  console.log('user-detail')
}

//event handlers
commands.map(({command}) => {
  emitter.on(command, responders[command])
})


//init CLI interface
const cliInput = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> ',
  completer: function completer(line) {
    const completions = commands.map(f.prop('command'))
    const hits = completions.filter((c) => c.startsWith(line))
    // show all completions if none found
    return [hits.length ? hits : completions, line]
  }
})

//listen to user input
cliInput.prompt()
cliInput.on('line', (line) => {
  line = line.trim()
  const matched = commands.filter(({command}) => line.toLowerCase().indexOf(command) !== -1)

  if (matched.length) {
    matched.map(({command}) => {
      emitter.emit(command, parseArgs(command, line))
    })
  } else {
    emitter.emit('help')
  }

  cliInput.prompt()
})

cliInput.on('close', () => process.exit(0))
