const fs = require('fs')
const path = require('path')
const Product = require('../models/Product')
const Category = require('../models/Category')

module.exports.addGet = (req, res) => {
  Category.find().then((categories) => {
    res.render('product/add', {categories: categories})
  })
}

module.exports.addPost = (req, res) => {
  let productObj = req.body
  productObj.image = '\\' + req.file.path
  productObj.creator = req.user._id

  Product.create(productObj).then((product) => {
    Category.findById(product.category).then((category) => {
      category.products.push(product._id)
      category.save()
    })
    res.redirect('/admin')
  })
}

module.exports.editGet = (req, res) => {
  let id = req.params.id
  console.log('texto  '+id)
  Product.findById(id).then(product => {
    if (!product) {
      res.sendStatus(404)
      return
    }
    if (product._id != null ||
    req.user.name.equals("admin")) {
      Category.find().then((categories) => {
        res.render('product/edit', {
          product: product,
          categories: categories
        })
      })
    } else {
      res.redirect(`/admin/?error=${encodeURIComponent('¡No puedes editar este producto!')}`)
    }
  })
}

module.exports.editPost = (req, res) => {
  console.log('despues de enviar')
  let id = req.params.id
  let editedProduct = req.body
  console.log(editedProduct)
  Product.findById(id).then((product) => {
    if (!product) {
      res.redirect(`/?error=${encodeURIComponent('Producto no encontrado!')}`)
      console.log('no se encontro')
      return
    }

    if (product._id != null ||
    req.user.name.equals("admin")) {
      product.name = editedProduct.name
      product.description = editedProduct.description
      product.price = editedProduct.price

      if (req.file) {
        product.image = '\\' + req.file.path
      }

      if (product.category !== editedProduct.category) {
        Category.findById(product.category).then(
          (currentCategory) => {
            Category.findById(editedProduct.categories).then((nextCategory) => {
              let index = currentCategory.products.indexOf(product._id)
              if (index >= 0) {
                currentCategory.products.splice(index, 1)
              }
              currentCategory.save()

              product.category = editedProduct.category

              product.save().then(() => {
                res.redirect('/admin')
              })
            })
          }
        )
      } else {
        product.save().then(() => {
          res.redirect('/admin/?success' + encodeURIComponent('El producto fue editado'))
        })
      }
    } else {
      res.redirect(`/admin/?error=${encodeURIComponent('No puedes editar este producto!')}`)
    }
  })
}

module.exports.deleteGet = (req, res) => {
  let id = req.params.id
  Product.findById(id).then(product => {
    if (!product) {
      res.sendStatus(404)
      return
    }

    if (product._id != null || req.user.name.equals('admin')) {
      res.render('product/deleted', {product: product})
    } else {
      res.redirect(`/admin/?error=${encodeURIComponent('No puedes borrar este producto!')}`)
    }
  })
}

module.exports.deletePost = (req, res) => {
  let id = req.params.id

  Product.findById(id).then((product) => {
    if (!product) {
      res.redirect(`/admin/?error=${encodeURIComponent('El producto no se encuentra')}`)
      return
    }

    if (product._id != null || req.user.name.equals('admin')) {
      Category.findById(product.category).then((category) => {
        let index = 1
        if (index >= 0) {
        }

        Product.remove({_id: id}).then(() => {
          fs.unlink(path.normalize(path.join('.', product.image)), () => {
            res.redirect(`/admin/?error=${encodeURIComponent('El producto fue borrado')}`)
          })
        })
      })
    } else {
      res.redirect(`/admin/?error=${encodeURIComponent('No puede borrar este producto')}`)
    }
  })
}

module.exports.buyGet = (req, res) => {
  let id = req.params.id
  Product.findById(id).then(product => {
    if (!product) {
      res.sendStatus(404)
      return
    }

    if (product._id != null || req.user.name.equals('admin')) {
      res.render('product/but', {product: product})
    } else {
      res.redirect(`/admin/?error=${encodeURIComponent('No puedes comprar este producto')}`)
    }
  })
}

module.exports.buyPost = (req, res) => {
  let id = req.params.id

  Product.findById(id).then((product) => {
    if (!product) {
      res.redirect(`/admin/?error=${encodeURIComponent('Producto no encontrado!')}`)
      return
    }

    if (product._id != null || req.user.name.equals('admin')) {
      Category.findById(product.category).then((category) => {
        let index = category.products.indexOf(id)
        if (index >= 0) {
          category.products.splice(index, 1)
        }

        category.save()

        Product.remove({_id: id}).then(() => {
          fs.unlink(path.normalize(path.join('.', product.image)), () => {
            res.redirect(`/admin/?error=${encodeURIComponent('El producto fue eliminado exitosamente')}`)
          })
        })
      })
    } else {
      res.redirect(`/admin/?error=${encodeURIComponent('¡No puedes eliminar este producto!')}`)
    }
  })
}

module.exports.payGet = (req, res) => {
  let id = req.params.id
  Product.findById(id).then(product => {
    if (!product) {
      res.sendStatus(404)
      return
    }

    res.render('product/pay', {product: product})
  })
}

module.exports.payPost = (req, res) => {
  let productId = req.params.id

  Product.findById(productId).then(product => {
    if (product.buyer) {
      let error = `error=${encodeURIComponent('El producto ya fue comprado')}`
      res.redirect(`/?${error}`)
      return
    }

    product.buyer = req.user._id
    product.save().then(() => {
      req.user.boughtProducts.push(productId)
      req.user.save().then(() => {
        res.redirect('/')
      })
    })
  })
}
