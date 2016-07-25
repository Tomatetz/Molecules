const _ = require('../util'),
  dom = require('../dom'),
  {Directive} = require('../binding'),
  expression = require('../expression'),
  expressionArgs = ['$el', '$event']

function registerDirective(name, opt) {
  let cls = Directive.register(name, opt)
  module.exports[cls.className] = cls
}

export class EventDirective extends Directive {
  constructor(el, tpl, expr, attr) {
    super(el, tpl, expr, attr)
    this.handler = this.handler.bind(this)
    this.expression = expression.parse(this.expr, expressionArgs)
  }

  handler(e) {
    let scope = this.scope(),
      exp = this.expression,
      fn

    e.stopPropagation()
    if (this.expression.applyFilter(e, this, [scope, this.el, e]) === false)
      return
    fn = exp.execute.call(this, scope, this.el, e)
    if (exp.simplePath) {
      if (typeof fn != 'function')
        throw TypeError('Invalid Event Handler:' + this.expr + ' -> ' + fn)
      let _scope = this.propScope(exp.path[0])
      fn.call(_scope, scope, this.el, e, _scope)
    }
  }

  bind() {
    super.bind()
    dom.on(this.el, this.eventType, this.handler)
  }

  unbind() {
    super.unbind()
    dom.off(this.el, this.eventType, this.handler)
  }
}

const events = ['blur', 'change', 'click', 'dblclick', 'error', 'focus', 'keydown', 'keypress', 'keyup', 'load',
  'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'resize', 'scroll', 'select', 'submit', 'unload', {
    name: 'oninput',
    eventType: 'input propertychange'
  }]

_.each(events, (opt) => {
  opt = _.isObject(opt) ? opt : {
    eventType: opt
  }
  opt.name = opt.name || `on${opt.eventType}`
  opt.extend = EventDirective
  registerDirective(opt.name, opt)
})
