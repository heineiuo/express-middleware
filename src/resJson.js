function sendJson (){
  return function (req, res, next) {
    res.json = function (json) {
      try {
        res.write(JSON.stringify(json))
        res.end()
      } catch(e){
        next(e)
      }
    }
    next()
  }
}

module.exports = sendJson