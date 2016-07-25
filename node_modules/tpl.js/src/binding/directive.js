const _ = require('../util'),
  dom = require('../dom'),
  Binding = require('./binding'),
  dynamicDirectiveOptions = {
    extend: 'extend',
    constructor: 'constructor'
  },
  directives = {}

class Directive extends Binding {
  constructor(el, tpl, expr, attr) {
    super(tpl, expr)
    this.el = el
    this.attr = attr
    dom.removeAttr(this.el, this.attr)
    if (Binding.generateComments) {
      this.comment = document.createComment(' Directive:' + this.name + ' [' + this.expr + '] ')
      dom.before(this.comment, this.el)
    }
  }
}
Directive.prototype.abstract = false
Directive.prototype.block = false
Directive.prototype.priority = 5

_.assign(Directive, {
  getDirective(name) {
    return directives[name]
  },
  isDirective(object) {
    return _.isExtendOf(object, Directive)
  },
  register(name, option) {
    let directive
    if (_.isFunc(option)) {
      if (!_.isExtendOf(option, Directive))
        throw TypeError(`Invalid Class Constructor, ${option.name} is not extend of Directive`)
      directive = option
    } else {
      directive = _.dynamicClass(option, Directive, dynamicDirectiveOptions)
    }

    if (!directive.className)
      directive.prototype.className = directive.className = (_.hump(name) + 'Directive')

    name = name.toLowerCase()

    if (name in directives)
      console.warn(`Directive[${name}] is defined`)

    directives[name] = directive
    return directive
  }
})
module.exports = Directive
