const AbstractBinding = require('./abstractBinding')

class Binding extends AbstractBinding {
  constructor(tpl, expr) {
    super(tpl)
    this.expr = expr
  }
}
Binding.generateComments = true

module.exports = Binding
