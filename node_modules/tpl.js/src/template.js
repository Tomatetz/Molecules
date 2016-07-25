const _ = require('./util'),
  dom = require('./dom'),
  TemplateInstance = require('./templateInstance')

const parseDelimiterReg = function(delimiter) {
    return new RegExp([delimiter[0], '([^', delimiter[0],']*)', delimiter[1]].join(''), 'g')
  },
  parseDirectiveReg = function(prefix) {
    return new RegExp('^' + prefix)
  },
  defaultCfg = {
    delimiter: ['{', '}'],
    directivePrefix: 'tpl-'
  }

class Template {
  constructor(templ, cfg = {}) {
    let el = document.createElement('div')
    if (typeof templ == 'string') {
      templ = _.trim(templ)
      if (templ.charAt(0) == '<')
        el.innerHTML = templ
      else
        dom.append(el, dom.query(templ))
    } else {
      dom.append(el, templ)
    }
    this.el = el
    this.directivePrefix = cfg.directivePrefix || defaultCfg.directivePrefix
    this.delimiter = cfg.delimiter || defaultCfg.delimiter
    this.directiveReg = parseDirectiveReg(this.directivePrefix)
    this.delimiterReg = parseDelimiterReg(this.delimiter)
  }

  complie(scope) {
    return new TemplateInstance(dom.cloneNode(this.el), scope, this.delimiterReg, this.directiveReg)
  }
}
module.exports = Template
