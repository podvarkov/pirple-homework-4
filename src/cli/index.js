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
    man: 'Lookup the details of a specific order by order ID | user Id',
    option: '--id --userId'
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

responders.menu = async () => {
  let menu = await db.products.getProducts()
  menu = menu.map(product => {
    return f.toPairs(product).map(([key, value]) => {
      let padding = Math.max(...f.toPairs(product).map(([key]) => key.length))
      padding = padding + 15 - (key.length)
      return format('%s%s%s\n', colorify(colors.fgMagenta, key), ' '.repeat(padding), value)
    }).join('')
  })

  console.log('%s\n%s\n%s', centered('MENU'), hLine('='), menu.join(hLine('=')))
  cliInput.prompt()
}

responders.orders = async () => {
  let orders = await db.orders.getAllOrders()
  orders = orders
    .filter(({created}) => created > (Date.now() - 86400000)) //last 24 hours in ms
    .map(f.dissoc('cart'))

  orders = orders.map(order => {
    return f.toPairs(order).map(([key, value]) => {
      let padding = Math.max(...f.toPairs(order).map(([key]) => key.length))
      padding = padding + 15 - (key.length)
      value = Array.isArray(value) ? value.join(',') : value
      return format('%s%s%s\n', colorify(colors.fgMagenta, key), ' '.repeat(padding), value)
    }).join('')
  })

  console.log('%s\n%s\n%s', centered('ORDERS'), hLine('='), orders.join(hLine('=')))
  cliInput.prompt()
}

responders['order-detail'] = async (args) => {
  let orders

  if (args['--userId']) {
    orders = await db.orders.getOrders(args['--userId'])
    orders = orders.map(f.dissoc('cart')).map(order => {
      return f.toPairs(order).map(([key, value]) => {
        let padding = Math.max(...f.toPairs(order).map(([key]) => key.length))
        padding = padding + 15 - (key.length)
        value = Array.isArray(value) ? value.join(',') : value
        return format('%s%s%s\n', colorify(colors.fgMagenta, key), ' '.repeat(padding), value)
      }).join('')
    })
    console.log('%s\n%s\n%s', centered('ORDERS'), hLine('='), orders.join(hLine('=')))
  } else {
    if (args['--id']) {
      orders = await db.orders.getAllOrders()
      const order = f.first(orders
        .filter(f.propEq('chargeId', args['--id']))
        .map(f.dissoc('cart')))
      if (!order) {
        console.log(colorify(colors.fgRed, 'Order not found'))
      } else {
        const message = f.toPairs(order).map(([key, value]) => {
          let padding = Math.max(...f.toPairs(order).map(([key]) => key.length))
          padding = padding + 15 - (key.length)
          value = Array.isArray(value) ? value.join(',') : value
          return format('%s%s%s\n', colorify(colors.fgMagenta, key), ' '.repeat(padding), value)
        }).join('')
        console.log('%s\n%s\n%s', centered('ORDERS'), hLine('='), message)
      }
    }
    else {
      console.log(colorify(colors.fgRed, 'Must specify ID or user ID'))
    }
  }
  cliInput.prompt()
}

responders.users = async () => {
  let users = await db.users.getUsers()
  users = users.filter(({created_at}) => created_at > (Date.now() - 86400000)) //last 24 hours in ms

  users = users.map(user => {
    return f.toPairs(user).map(([key, value]) => {
      let padding = Math.max(...f.toPairs(user).map(([key]) => key.length))
      padding = padding + 15 - (key.length)
      value = Array.isArray(value) ? value.join(',') : value
      return format('%s%s%s\n', colorify(colors.fgMagenta, key), ' '.repeat(padding), value)
    }).join('')
  })

  console.log('%s\n%s\n%s', centered('USERS'), hLine('='), users.join(hLine('=')))
  cliInput.prompt()
}

responders['user-detail'] = async (args) => {
  if (!args['--email']) {
    console.log(colorify(colors.fgRed, 'Must specify email'))
  } else {
    const usersByEmail = await db.users.getUserByEmail(args['--email'])
    if (usersByEmail.length) {
      const user = f.toPairs(f.first(usersByEmail)).map(([key, value]) => {
        let padding = Math.max(...f.toPairs(f.first(usersByEmail)).map(([key]) => key.length))
        padding = padding + 15 - (key.length)
        return format('%s%s%s\n', colorify(colors.fgMagenta, key), ' '.repeat(padding), value)
      }).join('')

      console.log('%s\n%s%s', centered(f.prop('name', f.first(usersByEmail))), hLine('='), user)
    } else {
      console.log(colorify(colors.fgRed, 'User not found'))
    }
  }
  cliInput.prompt()
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
