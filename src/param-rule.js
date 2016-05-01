var _ = require('lodash')
var rules = ['has', 'isNumber', 'is']

module.exports.Rule = function (name, wheres, ruleName) {
  return {
    name: name,
    wheres: _.isArray(wheres)?wheres:[wheres],
    ruleName: ruleName||'has'
  }
}

module.exports.use = function (rules) {
  if (!_.isArray(rules)) rules = Array.prototype.slice.call(arguments,0)
  return function (req, res, next) {
    console.log('checking params...')
    var errorStack = []
    _.map(rules, function (rule, index) {
      _.map(rule.wheres, function(where, index){
        console.log('check if '+where+' has '+rule.name)
        if (rule.ruleName == 'has') {
          console.log(_.has(req[where], rule.name))
          if (!_.has(req[where], rule.name)) {
            errorStack.push({
              errorType: "LOST_PARAM",
              paramName: rule.name
            })
          }
        } else if (rule.ruleName == 'isNumber') {
          console.log('check if '+where+' has a number '+rule.name)
          if (!_.isNumber(req[where][rule.name])) {
            errorStack.push({
              errorType: "LOST_PARAM",
              paramName: rule.name
            })
          }
        }
      })
    })
    console.log(errorStack.length?"[fail] some parms error":"[ok] params pass")
    next(errorStack.length?{error: "PARAM_ILLEGAL", errorStack: errorStack}:null)
  }
}