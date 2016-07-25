const _ = require('../util'),
  dom = require('../dom'),
  {Directive} = require('../binding'),
  expression = require('../expression'),
  {YieId} = _,
  expressionArgs = ['$el']

function registerDirective(name, opt) {
  let cls = Directive.register(name, opt)
  module.exports[cls.className] = cls
}

export class SimpleDirective extends Directive {
  constructor(el, tpl, expr, attr) {
    super(el, tpl, expr, attr)
    this.observeHandler = this.observeHandler.bind(this)
    this.expression = expression.parse(this.expr, expressionArgs)
  }

  realValue() {
    return this.expression.execute.call(this, this.scope(), this.el)
  }

  value() {
    return this.expression.executeAll.call(this, this.scope(), this.el)
  }

  bind() {
    super.bind()
    _.each(this.expression.identities, (ident) => {
      this.observe(ident, this.observeHandler)
    })
    this.update(this.value())
  }

  unbind() {
    super.unbind()
    _.each(this.expression.identities, (ident) => {
      this.unobserve(ident, this.observeHandler)
    })
  }

  blankValue(val) {
    if (arguments.length == 0)
      val = this.value()
    return _.isNil(val) ? '' : val
  }

  observeHandler(expr, val) {
    if (this.expression.simplePath) {
      this.update(this.expression.applyFilter(val, this, [this.scope(), this.el]))
    } else {
      this.update(this.value())
    }
  }

  update(val) {
    throw 'Abstract Method [' + this.className + '.update]'
  }
}

const EVENT_CHANGE = 'change',
  EVENT_INPUT = 'input',
  EVENT_CLICK = 'click',
  TAG_SELECT = 'SELECT',
  TAG_INPUT = 'INPUT',
  TAG_TEXTAREA = 'TEXTAREA',
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  directives = {
    text: {
      update(val) {
        dom.text(this.el, this.blankValue(val))
      },
      block: true
    },
    html: {
      update(val) {
        dom.html(this.el, this.blankValue(val))
      },
      block: true
    },
    'class': {
      update(value) {
        if (value && typeof value == 'string') {
          this.handleArray(_.trim(value).split(/\s+/))
        } else if (value instanceof Array) {
          this.handleArray(value)
        } else if (value && typeof value == 'object') {
          this.handleObject(value)
        } else {
          this.cleanup()
        }
      },

      handleObject(value) {
        this.cleanup(value, false)
        let keys = this.prevKeys = [],
          el = this.el
        for (let key in value) {
          if (value[key]) {
            dom.addClass(el, key)
            keys.push(key)
          } else {
            dom.removeClass(el, key)
          }
        }
      },

      handleArray(value) {
        this.cleanup(value, true)
        let keys = this.prevKeys = [],
          el = this.el
        _.each(value, (val) => {
          if (val) {
            keys.push(val)
            dom.addClass(el, val)
          }
        })
      },

      cleanup(value, isArr) {
        let prevKeys = this.prevKeys
        if (prevKeys) {
          let i = prevKeys.length,
            el = this.el
          while (i--) {
            let key = prevKeys[i]
            if (!value || (isArr ? _.indexOf(value, key) == -1 : !_.hasOwnProp(value, key))) {
              dom.removeClass(el, key)
            }
          }
        }
      }
    },
    'style': {
      update(value) {
        if (value && _.isString(value)) {
          dom.style(this.el, value)
        } else if (value && _.isObject(value)) {
          this.handleObject(value)
        }
      },

      handleObject(value) {
        this.cleanup(value)
        let keys = this.prevKeys = [],
          el = this.el
        _.each(value, (val, key) => {
          dom.css(el, key, val)
        })
      }
    },
    show: {
      update(val) {
        dom.css(this.el, 'display', val ? '' : 'none')
      }
    },
    hide: {
      update(val) {
        dom.css(this.el, 'display', val ? 'none' : '')
      }
    },
    value: {
      update(val) {
        dom.val(this.el, this.blankValue(val))
      }
    },
    'if': {
      bind() {
        SimpleDirective.prototype.bind.call(this)
        if (!this.directives)
          return (this.yieId = new YieId())
      },
      update(val) {
        if (!val) {
          dom.css(this.el, 'display', 'none')
        } else {
          if (!this.directives) {
            let directives = this.directives = this.tpl.parseChildNodes(this.el)
            _.each(directives, (dir) => {
              dir.bind()
            })
            if (this.yieId) {
              this.yieId.done()
              this.yieId = undefined
            }
          }
          dom.css(this.el, 'display', '')
        }
      },
      unbind() {
        SimpleDirective.prototype.unbind.call(this)
        if (this.directives) {
          let directives = this.directives
          _.each(directives, (dir) => {
            dir.unbind()
          })
        }
      },
      priority: 9,
      block: true
    },
    checked: {
      update(val) {
        _.isArray(val) ? dom.checked(this.el, _.indexOf(val, dom.val(this.el))) : dom.checked(this.el, !!val)
      }
    },
    selected: {
      update(val) {}
    },
    focus: {
      update(val) {
        if (val)
          dom.focus(this.el)
      }
    },
    input: {
      constructor(el) {
        SimpleDirective.apply(this, arguments)

        if (!this.expression.simplePath)
          throw TypeError(`Invalid Expression[${this.expression.expr}] on InputDirective`)

        this.onChange = this.onChange.bind(this)
        let tag = this.tag = el.tagName
        switch (tag) {
          case TAG_SELECT:
            this.event = EVENT_CHANGE
            break
          case TAG_INPUT:
            let type = this.type = el.type
            this.event = (type == RADIO || type == CHECKBOX) ? EVENT_CHANGE : EVENT_INPUT
            break
          case TAG_TEXTAREA:
            throw TypeError('Directive[input] not support ' + tag)
            break
          default:
            throw TypeError('Directive[input] not support ' + tag)
        }
      },

      bind() {
        SimpleDirective.prototype.bind.call(this)
        dom.on(this.el, this.event, this.onChange)
      },

      unbind() {
        SimpleDirective.prototype.unbind.call(this)
        dom.off(this.el, this.event, this.onChange)
      },

      setRealValue(val) {
        this.set(this.expression.path, val)
      },

      setValue(val) {
        this.setRealValue(this.expression.applyFilter(val, this, [this.scope(), this.el], false))
      },

      onChange(e) {
        let val = this.elVal(),
          idx,
          _val = this.val
        if (val != _val)
          this.setValue(val)
        e.stopPropagation()
      },

      update(val) {
        let _val = this.blankValue(val)
        if (_val != this.val)
          this.elVal((this.val = _val))
      },

      elVal(val) {
        let tag = this.tag

        switch (tag) {
          case TAG_SELECT:
            break
          case TAG_INPUT:
            let type = this.type

            if (type == RADIO || type == CHECKBOX) {
              if (arguments.length == 0) {
                return dom.checked(this.el) ? dom.val(this.el) : undefined
              } else {
                let checked

                checked = val == dom.val(this.el)
                if (dom.checked(this.el) != checked)
                  dom.checked(this.el, checked)
              }
            } else {
              if (arguments.length == 0) {
                return dom.val(this.el)
              } else if (val != dom.val(this.el)) {
                dom.val(this.el, val)
              }
            }
            break
          case TAG_TEXTAREA:
            throw TypeError('Directive[input] not support ' + tag)
            break
          default:
            throw TypeError('Directive[input] not support ' + tag)
        }
      },
      priority: 4
    }
  }

_.each(directives, (opt, name) => {
  opt.extend = SimpleDirective
  registerDirective(name, opt)
})
