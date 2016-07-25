const _ = require('../util'),
  dom = require('../dom'),
  expression = require('../expression'),
  Binding = require('./binding'),
  expressionArgs = ['$el']

class Text extends Binding {
  constructor(el, tpl, expr) {
    super(tpl, expr)
    this.el = el
    this.observeHandler = this.observeHandler.bind(this)
    this.expression = expression.parse(this.expr, expressionArgs)

    if (Binding.generateComments) {
      this.comment = document.createComment('Text Binding ' + this.expr)
      dom.before(this.comment, this.el)
    }
  }

  value() {
    return this.expression.executeAll.call(this, this.scope(), this.el)
  }

  bind() {
    super.bind()
    _.each(this.expression.identities, (ident)=>{
      this.observe(ident, this.observeHandler)
    })
    this.update(this.value())
  }

  unbind() {
    super.unbind()
    _.each(this.expression.identities, (ident)=>{
      this.unobserve(ident, this.observeHandler)
    })
  }

  observeHandler(attr, val) {
    if (this.expression.simplePath) {
      this.update(this.expression.applyFilter(val, this, [this.scope(), this.el]))
    } else {
      this.update(this.value())
    }
  }

  update(val) {
    if (_.isNil(val))
      val = ''
    if (val !== dom.text(this.el))
      dom.text(this.el, val)
  }
}
module.exports = Text
