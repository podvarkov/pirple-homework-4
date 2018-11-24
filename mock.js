const create = require("./src/lib/db").create;
const uuid = require("./src/lib/helpers").uuid;

const product = (i) =>({
  id: uuid(),
  name: `Pizza #${i}`,
  price: Math.floor(Math.random()*30) + "$"
})

for (let i=1; i<11; i++) {
  console.log(i)
  const pizza = product(i)
  console.log(pizza.name)
  create('products', pizza.id, pizza)
}