const controllers = require('../controllers')
const multer = require('multer')
const auth = require('./auth')

let upload = multer({dest: './recursos/images'})

module.exports = (app) => {
  //rutas de inicio
  /*para el administrador */
  app.get('/admin', controllers.home.index)
  /*para el usuario comun */
  app.get('/', controllers.home.index2)
  //ruta de administrar productos
  app.get('/product/add', auth.isAuthenticated, controllers.product.addGet)
  app.post('/product/add', auth.isAuthenticated, upload.single('image'), controllers.product.addPost)

  app.get('/product/edit/:id', auth.isAuthenticated, controllers.product.editGet)
  app.post('/product/edit/:id', auth.isAuthenticated, upload.single('image'), controllers.product.editPost)

  app.get('/product/delete/:id', auth.isAuthenticated, controllers.product.deleteGet)
  app.post('/product/delete/:id', auth.isAuthenticated, controllers.product.deletePost)

  //ruta de administrar categoria
  app.get('/category/add', controllers.category.addGet)
  app.post('/category/add', controllers.category.addPost)
  app.get('/category/:category/products', controllers.category.productByCategory)

  //ruta para compra del usuario
  app.get('/product/buy/:id', auth.isAuthenticated, controllers.product.buyGet)
  app.post('/product/buy/:id', auth.isAuthenticated, controllers.product.buyPost)

  //pagar
  app.get('/product/pay/:id', auth.isAuthenticated, controllers.product.payGet)
  app.post('/product/pay/:id', auth.isAuthenticated, controllers.product.payPost)

  //ruta para el registro y login de los usuarios
  app.get('/user/register', controllers.user.registerGet)
  app.post('/user/register', controllers.user.registerPost)

  app.get('/user/login', controllers.user.loginGet)
  app.post('/user/login', controllers.user.loginPost)

  app.post('/user/logout', auth.isAuthenticated, controllers.user.logout)
}
