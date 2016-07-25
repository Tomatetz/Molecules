const AbstractBinding = require('./abstractBinding'),
  {YieId} = require('../util')

class DirectiveGroup extends AbstractBinding {
  constructor(el, tpl, directiveConfigs) {
    super(tpl)
    this.el = el
    this.directiveConfigs = directiveConfigs.sort((a, b) => {
      return (b.const.prototype.priority - a.const.prototype.priority) || 0
    })
    this.directives = []
    this.bindedCount = 0
  }

  bind() {
    super.bind()
    let directives = this.directives,
      directiveConfigs = this.directiveConfigs,
      tpl = this.tpl,
      el = this.el,
      directiveCount = this.directiveConfigs.length,
      self = this
    function parse() {
      let idx = self.bindedCount,
        directive = directives[idx],
        ret
      if (!directive) {
        let cfg = directiveConfigs[idx]
        directive = directives[idx] = new cfg.const(el, tpl,
          cfg.expression, cfg.attr)
      }
      ret = directive.bind()
      if ((++self.bindedCount) < directiveCount) {
        if (ret && ret instanceof YieId)
          ret.then(parse)
        else
          parse()
      }
    }
    parse()
  }

  unbind() {
    super.unbind()
    let directives = this.directives
    for (let i = 0, l = this.bindedCount; i < l; i++) {
      directives[i].unbind()
    }
    this.bindedCount = 0
  }
}
module.exports = DirectiveGroup
