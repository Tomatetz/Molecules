const _ = require('../util'),
  dom = require('../dom'),
  {
    Directive
  } = require('../binding'),
  TemplateInstance = require('../templateInstance'),
  eachReg = /^\s*([\s\S]+)\s+in\s+([\S]+)(\s+track\s+by\s+([\S]+))?\s*$/,
  eachAliasReg = /^(\(\s*([^,\s]+)(\s*,\s*([\S]+))?\s*\))|([^,\s]+)(\s*,\s*([\S]+))?$/

export class EachDirective extends Directive {
  constructor(el, tpl, expr, attr) {
    super(el, tpl, expr, attr)
    this.observeHandler = this.observeHandler.bind(this)
    this.lengthObserveHandler = this.lengthObserveHandler.bind(this)

    let token = expr.match(eachReg)
    if (!token)
      throw Error(`Invalid Expression[${expr}] on Each Directive`)

    this.scopeExpr = token[2]
    this.indexExpr = token[4]

    let aliasToken = token[1].match(eachAliasReg)
    if (!aliasToken)
      throw Error(`Invalid Expression[${token[1]}] on Each Directive`)

    this.valueAlias = aliasToken[2] || aliasToken[5]
    this.keyAlias = aliasToken[4] || aliasToken[7]

    this.begin = document.createComment('each begin')
    dom.before(this.begin, this.el)
    this.end = document.createComment('each end')
    dom.after(this.end, this.begin)

    dom.remove(this.el)
    let div = document.createElement('div')
    dom.append(div, this.el)
    this.el = div
  }

  update(data) {
    let parentScope = this.realScope(),
      begin = this.begin,
      end = this.end,
      indexExpr = this.indexExpr,
      valueAlias = this.valueAlias,
      keyAlias = this.keyAlias,
      init = !this.cache,
      oldSort = this.sort,
      sort = this.sort = new Array(data.length),
      cache = init ? (this.cache = {}) : this.cache,
      removed = [],
      added = []


    _.each(data, (item, idx) => {
      let index = indexExpr ? _.get(item, indexExpr) : idx, // read index of data item
        scope = !init && cache[index] // find scope in cache

      if (scope) { // update scope
        this.initScope(scope, item, idx, index)
      } else { // create scope
        scope = cache[index] = this.createScope(parentScope, item, idx, index)
        if (!init)
          added.push(scope)
      }
      sort[idx] = scope // update sort
      if (init) { // init compontent
        scope.$tpl = new TemplateInstance(dom.cloneNode(this.el), scope, this.tpl.delimiterReg, this.tpl.directiveReg)
        data[idx] = scope[valueAlias]
        scope.$tpl.before(end)
      }
    })
    if (!init) {
      _.each(oldSort, (oldScope) => {
        let scope = cache[oldScope.$index]
        if (scope && scope !== sort[oldScope.$sort]) {
          removed.push(oldScope)
          cache[oldScope.$index] = undefined
        }
      })

      _.each(added, (scope) => {
        let scope2 = removed.pop()
        if (scope2) {
          this.initScope(scope2, scope)
          cache[scope.$index] = scope2
          sort[scope.$sort] = scope2
          scope = scope2
        } else {
          scope.$tpl = new TemplateInstance(dom.cloneNode(this.el), scope, this.tpl.delimiterReg, this.tpl.directiveReg)
        }
        data[scope.$sort] = scope[valueAlias]
        scope.$tpl.after(scope.$sort ? sort[scope.$sort - 1].$tpl.els : begin)
      })

      _.each(removed, (scope) => {
        scope.$tpl.destroy()
      })
    }
  }

  createScope(parentScope, value, i, index) {
    let scope = _.create(parentScope)
    scope.$parent = parentScope
    scope.$eachContext = this
    scope.$tpl = null
    this.initScope(scope, value, i, index, true)
    return scope
  }

  initScope(scope, value, i, index, isCreate) {
    if (!isCreate)
      scope = scope.$tpl.scope
    scope.$sort = i
    scope[this.valueAlias] = value
    if (this.keyAlias)
      scope[this.keyAlias] = i
    scope.$index = index
  }

  bind() {
    super.bind()
    this.observe(this.scopeExpr, this.observeHandler)
    this.observe(this.scopeExpr + '.length', this.lengthObserveHandler)
    this.update(this.target())
  }

  unbind() {
    super.unbind()
    this.unobserve(this.scopeExpr, this.observeHandler)
    this.unobserve(this.scopeExpr + '.length', this.lengthObserveHandler)
  }

  target() {
    return this.get(this.scopeExpr)
  }

  observeHandler(expr, target) {
    this.update(target)
  }

  lengthObserveHandler() {
    this.update(this.target())
  }
}
EachDirective.prototype.abstract = true
EachDirective.prototype.block = true
EachDirective.prototype.priority = 10

Directive.register('each', EachDirective)
