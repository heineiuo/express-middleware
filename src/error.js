function err500 (err, req, res, next) {
  if (!err) return next()
  console.log('[error] '+err.toString())
  console.log('[error stack] '+err.stack)
  if (typeof err == 'string') {
    res.json({error: err})
  } else {
    try{
      res.json(err)
    } catch(e){
      res.json({error: "EXCEPTION_ERROR"})
    }
  }
}

function err404(req, res) {
  if (res.sendStatus) return res.sendStatus(404)
  res.writeHead(404)
  res.write('Not Found')
  res.end()
}

module.exports.err500 = err500
module.exports.err404 = err404