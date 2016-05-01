const confMiddleware = function(conf){
  return function(req, res, next){
    res.locals.conf = conf
    res.locals.weixinConfig = conf.weixin
    res.locals.wechatConfig = conf.weixin
    next()
  }
}

export default confMiddleware