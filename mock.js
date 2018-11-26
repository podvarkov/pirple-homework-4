const {create} = require('./src/lib/db')
const {uuid} = require('./src/lib/helpers')

const product = (i) => ({
  id: uuid(),
  name: `Pizza #${i}`,
  price: Math.floor(Math.random() * 30),
  currency: 'USD'
})

for (let i = 1; i < 11; i++) {
  const pizza = product(i)
  create('products', pizza.id, pizza)
}