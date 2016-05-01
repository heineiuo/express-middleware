import seashell from 'seashell'
import {awaitify2} from '../lib/awaitify'
import User from '../model/User'
import UserFromWechat from '../model/UserFromWechat'

const getUserInfo = async function(req, res, next){

  try {

    var fudiUserInfo = await UserFromWechat.findOne({
      openid: req.query.openid
    }).populate('user_id')

    if (fudiUserInfo.type=='wechat'
      && fudiUserInfo.wechat.accessTokenExpire >= Date.now()) {

      const wechatUserInfo = await awaitify2(seashell.import)(
        'wechat-mp',' auth.freshUserAccessToken', {
          wechatConfig: res.locals.wechatConfig
        })

      fudiUserInfo = await awaitify2(seashell.import)('fudi-order', {
        actionName: 'updateUserInfo',
        type: 'wechat',
        wechat: wechatUserInfo
      })
    }

    res.locals.userinfo = fudiUserInfo
  } catch(e){
    next(e)
  }

}

export {getUserInfo}