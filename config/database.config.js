//configuracion para la conexion para la base de datos
const mongoose = require('mongoose')
//promesa
mongoose.Promise = global.Promise

module.exports = (config) => {
  mongoose.connect(config.connectionString)

  let database = mongoose.connection

  database.once('open', (err) => {
    if (err) {
      console.log(err)
      return
    }
    console.log('Conexion con la base de datos exitosa')
  })

  database.on('error', (err) => {
    console.log(err)
  })

  require('../models/Product')
}
