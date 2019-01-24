const readline = require('readline')
const EventEmitter = require('events')
const {parseArgs} = require('./helpers')

class Emitter extends EventEmitter {
}

const emitter = new Emitter()

const commands = ['help', 'man', 'exit', 'menu', 'orders', 'order-detail', 'users', 'user-detail']


//responders
const responders = {}

responders.help = () => {
  console.log('help')
}

responders.man = () => {
  console.log('man')
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
commands.map(command => emitter.on(command, responders[command]))


//init CLI interface
const cliInput = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> ',
  completer: function completer(line) {
    const completions = commands
    const hits = completions.filter((c) => c.startsWith(line))
    // show all completions if none found
    return [hits.length ? hits : completions, line]
  }
})

//listen to user input
cliInput.prompt()
cliInput.on('line', (line) => {
  line = line.trim()
  const matched = commands.filter(command => line.toLowerCase().indexOf(command) !== -1)

  if (matched.length) {
    matched.map(command => {
      emitter.emit(command, parseArgs(command, line))
    })
  } else {
    emitter.emit('help')
  }

  cliInput.prompt()
})

cliInput.on('close', () => process.exit(0))

// 1. View all the current menu items
//
// 2. View all the recent orders in the system (orders placed in the last 24 hours)
//
// 3. Lookup the details of a specific order by order ID
//
// 4. View all the users who have signed up in the last 24 hours
//
// 5. Lookup the details of a specific user by email address