/* eslint-disable no-console */
const readline = require('readline')
const {format} = require('util')
const v8 = require('v8')
const os = require('os')
const EventEmitter = require('events')

const f = require('../lib/functions')
const db = require('../lib/db')
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
  },
  {
    command: 'stats',
    man: 'View system stats'
  }
]


//responders
const responders = {}

responders.help = () => {
  emitter.emit('man')
}

responders.man = () => {
  let message = commands.reduce((acc, {command, man, option = ''}) => {
    let padding = Math.max(...commands.map(({command, option}) => (command + option).length))
    padding = padding + 15 - ((command + option).length)
    acc += format('%s%s%s\n', colorify(colors.fgMagenta, [command, option].join(' ')), ' '.repeat(padding), man)
    return acc
  }, '')
  message = format('%s\n%s\n%s%s', centered('CLI MANUAL'), hLine('='), message, hLine('='))
  console.log(message)
  cliInput.prompt()
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

responders.users = async () => {
  let users = await db.users.getUsers()
  users = users.filter(({created_at}) => created_at > (Date.now() - 86400000))

  users = users.map(user => {
    return f.toPairs(user).map(([key, value]) => {
      let padding = Math.max(...f.toPairs(user).map(([key]) => key.length))
      padding = padding + 15 - (key.length)
      return format('%s%s%s\n', colorify(colors.fgMagenta, key), ' '.repeat(padding), value)
    }).join('')
  })

  console.log('%s\n%s\n%s', centered('USERS'), hLine('='), users.join(hLine('=')))
  cliInput.prompt()
}

responders['user-detail'] = () => {
  console.log('user-detail')
}

responders.stats = () => {
  const {
    malloced_memory,
    peak_malloced_memory,
    used_heap_size,
    total_heap_size,
    heap_size_limit
  } = v8.getHeapStatistics()

  let stats = {
    'Load Average': os.loadavg().join(' '),
    'CPU Count': os.cpus().length,
    'Free memory': os.freemem(),
    'Current Malloced Memory': malloced_memory,
    'Peak Malloced Memory': peak_malloced_memory,
    'Allocated Head Used (%)': (used_heap_size / total_heap_size) * 100,
    'Available Heap Allocated (%)': (total_heap_size / heap_size_limit) * 100,
    'Uptime': format('%s Seconds', os.uptime())
  }

  stats = f.toPairs(stats)

  let message = stats.reduce((acc, [key, value]) => {
    let padding = Math.max(...stats.map(([key]) => key.length))
    padding = padding + 15 - (key.length)
    acc += format('%s%s%s\n', colorify(colors.fgMagenta, key), ' '.repeat(padding), value)
    return acc
  }, '')

  message = format('%s\n%s\n%s%s', centered('SYSTEM STATS'), hLine('='), message, hLine('='))
  console.log(message)
  cliInput.prompt()
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
})

cliInput.on('close', () => process.exit(0))
