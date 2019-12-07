//configuracion de expresss
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport')

//configuracion de pug y la para establecer la ruta de las vistas
module.exports = (app, config) => {
  app.set('view engine', 'pug')
  app.set('views', path.join(config.rootPath, 'views'))

  app.use(bodyParser.urlencoded({extended: true}))

  //variables para la sesion
  app.use(cookieParser())
  app.use(session({secret: 'T0pSecreT', saveUninitialized: false, resave: false}))
  app.use(passport.initialize())
  app.use(passport.session())

  app.use((req, res, next) => {
    if (req.user) {
      res.locals.user = req.user
    }
    next()
  })

  //establecer ruta pa los contenidos
  app.use(express.static(path.normalize(path.join(config.rootPath, 'recursos'))))

  app.use((req, res, next) => {
    if (req.url.startsWith('/recursos')) {
      req.url = req.url.replace('/recursos', '')
    }

    next()
  }, express.static(path.normalize(path.join(config.rootPath, 'recursos'))))
}
