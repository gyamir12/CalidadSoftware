const Product = require('../models/Product')

module.exports.index = (req, res) => {
  let queryData = req.query
  

  Product.find({buyer: null}).populate('category').then((products) => {
    if (queryData.query) {
  console.log(queryData.query)
      products = products.filter(p => p.name.toLowerCase().includes(queryData.query))
    }
    let data = {products: products}
    if (req.query.error) {
      data.error = req.query.error
    } else if (req.query.success) {
      data.success = req.query.success
    }
    res.render('home/index', data)
  })
}

module.exports.index2 = (req, res) => {
  let queryData = req.query
  

  Product.find({buyer: null}).populate('category').then((products) => {
    if (queryData.query) {
      console.log('esto es home.js')
  console.log(queryData.query)
      products = products.filter(p => p.name.toLowerCase().includes(queryData.query))
    }

    let data = {products: products}
    if (req.query.error) {
      data.error = req.query.error
    } else if (req.query.success) {
      data.success = req.query.success
    }
    res.render('home/index2', data)
  })
}