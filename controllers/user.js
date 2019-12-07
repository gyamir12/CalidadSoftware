const User = require('../models/User')
const encryption = require('../utilities/encryption')

//envia los datos del registro
module.exports.registerGet = (req, res) => {
  res.render('user/register')
}

//Registro de Datos
module.exports.registerPost = (req, res) => {
  let user = req.body
  console.log(user)
  if (user.password && user.password !== user.confirmedPassword) {
    user.error = 'Passwords do not match.'
    res.render('user/register', user)
    return
  }

  let salt = encryption.generateSalt()
  user.salt = salt

  if (user.password) {
    let hashedPassword = encryption.generateHashedPassword(salt, user.password)
    user.password = hashedPassword
  }

  User.create(user).then(user => {
    req.logIn(user, (error, user) => {
      if (error) {
        res.render('user/register', {error: 'Registro no ingresado!'})
        return
      }

      res.redirect('/')
    })
  }).catch(error => {
    user.error = error
    res.render('user/register', user)
  })
}

//Envia los datos del login
module.exports.loginGet = (req, res) => {
  res.render('user/login')
}

//Validacion de Usuario
module.exports.loginPost = (req, res) => {
  let userToLogin = req.body
  console.log(userToLogin)
  User.findOne({username: userToLogin.username}).then(user => {
    if (!user || !user.authenticate(userToLogin.password)) {
      res.render('user/login', {error: 'Verifique contraseña o usuario'})
    } else {
      req.logIn(user, (error, user) => {
        if (error) {
          res.render('user/login', {error: 'Error de Sesion!'})
          return
        }
        if(userToLogin.username=='admin'){
          res.redirect('/admin')
        }else{
          res.redirect('/')
        } 
      })
    }
  })
}
//para desloguear
module.exports.logout = (req, res) => {
  req.logout()
  res.redirect('/')
}
