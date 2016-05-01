/**
 * connect mongodb.
 */

var mongoose = require('mongoose')

var dbConnect = {
  db: null,
  status: {
    isInited: false,
    isConnected: false,
    isConnecting: false
  },

  connect: function(dbConf) {
    var dbConnect = this
    dbConnect.db = dbConf
    connect()
  },

  middleware: function (dbConf) {
    init(dbConf)
    var dbConnect = this
    return function (req, res, next){
      res.locals.dbStatus = dbConnect.status
      next()
    }
  },
  showStatus: function(){
    return function(req, res, next){
      res.json({dbStatus: res.locals.dbStatus})
    }
  }

}


function init(dbConf){
  if (dbConnect.status.isInited) return false
  dbConnect.status.isInited = true
  dbConnect.connect(dbConf)
}

function connect() {
  var status = dbConnect.status
  var db = dbConnect.db

  if (status.isConnected || status.isConnecting) return false
  status.isConnecting = true
  mongoose.connect(db.uri, db.options, function(err) {
    status.isConnecting = false
    if (err) {
      console.log(err)
      return reConnect()
    }
    console.log("DB connected success on "+db.uri)
    status.isConnected = true
    return mongoose.connection.once("disconnected", reConnect)
  })
}

function reConnect(){
  var status = dbConnect.status
  var db = dbConnect.db

  console.log("DB will connect again after "+db.delay/1000+" second...")
  mongoose.connection.close()
  status.isConnected = false
  return setTimeout(connect, db.delay)
}

module.exports = dbConnect