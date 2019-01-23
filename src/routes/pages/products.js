const {parseTemplate} = require('../../lib/helpers')
const {products} = require('../../lib/db')

const handler = (req, cb) => {
  products.getProducts()
    .then(products => products.map(product => parseTemplate('_product', {product})))
    .then(promises => Promise.all([
      parseTemplate('_header', {head: {title: 'Products'}}),
      ...promises,
      parseTemplate('_footer')]))
    .then(page => cb({status: 200, payload: page.join(''), type: 'text/html'}))
}

module.exports = handler