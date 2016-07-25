const _ = require('../util'),
  proxy = _.proxy

class AbstractBinding {
  constructor(tpl) {
    this.tpl = tpl
    this.binded = false
  }

  scope() {
    return this.tpl.scope
  }

  realScope() {
    return _.obj(this.tpl.scope)
  }

  propScope(prop) {
    let scope = this.tpl.scope,
      parent = scope.$parent

    if (!parent)
      return scope

    while (parent && !_.hasOwnProp(scope, prop)) {
      scope = parent
      parent = scope.$parent
    }
    return proxy.proxy(scope) || scope
  }

  exprScope(expr) {
    let scope = this.tpl.scope,
      parent = scope.$parent,
      prop

    if (!parent)
      return scope

    prop = _.parseExpr(expr)[0]
    while (parent && !_.hasOwnProp(scope, prop)) {
      scope = parent
      parent = scope.$parent
    }
    return proxy.proxy(scope) || scope
  }

  observe(expr, callback) {
    _.observe(this.exprScope(expr), expr, callback)
  }

  unobserve(expr, callback) {
    _.unobserve(this.exprScope(expr), expr, callback)
  }

  get(expr) {
    return _.get(this.tpl.scope, expr)
  }

  has(expr) {
    return _.has(this.tpl.scope, expr)
  }

  set(expr, value) {
    _.set(this.tpl.scope, expr, value)
  }

  bind() {}

  unbind() {}

  destroy() {}
}

module.exports = AbstractBinding
