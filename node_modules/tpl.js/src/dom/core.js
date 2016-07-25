const _ = require('../util'),
  textContent = typeof document.createElement('div').textContent == 'string' ? 'textContent' : 'innerText'

let dom = {
  W3C: !!window.dispatchEvent,
  inDoc(el, root) {
    root = root || document.documentElement
    if (root.contains)
      return root.contains(el)
    try {
      while ((el = el.parentNode)) {
        if (el === root)
          return true
      }
    } catch (e) {}
    return false
  },
  query(selectors, all) {
    if (_.isString(selectors))
      return all ? document.querySelectorAll(selectors) : document.querySelector(selectors)
    return selectors
  },
  cloneNode(el, deep) {
    function clone(el) {
      return el.cloneNode(deep !== false)
    }
    return _.isArrayLike(el) ? _.map(el, clone) : clone(el)
  },
  remove(el) {
    function remove(el) {
      if (el.parentNode)
        el.parentNode.removeChild(el)
    }
    _.isArrayLike(el) ? _.each(el, remove) : remove(el)
  },
  before(el, target) {
    if (_.isArrayLike(target))
      target = target[0]

    let parent = target.parentNode

    function before(el) {
      parent.insertBefore(el, target)
    }
    _.isArrayLike(el) ? _.each(el, before) : before(el)
  },
  after(el, target) {
    if (_.isArrayLike(target))
      target = target[target.length - 1]

    let parent = target.parentNode,
      apply = parent.lastChild === target ? function(el) {
        parent.appendChild(el)
      } : function() {
        let next = target.nextSibling

        return function(el) {
          parent.insertBefore(el, next)
        }
      }()
    _.isArrayLike(el) ? _.each(el, apply) : apply(el)
  },
  append(target, el) {
    function append(el) {
      target.appendChild(el)
    }
    _.isArrayLike(el) ? _.each(el, append) : append(el)
  },
  prepend(target, el) {
    target.firstChild ? dom.before(el, el.firstChild) : dom.append(target, el)
  },
  html(el, html) {
    return arguments.length > 1 ? (el.innerHTML = html) : el.innerHTML
  },
  outerHtml(el) {
    if (el.outerHTML)
      return el.outerHTML

    let container = document.createElement('div')
    container.appendChild(el.cloneNode(true))
    return container.innerHTML
  },
  text(el, text) {
    if (el.nodeType == 3)
      return arguments.length > 1 ? (el.data = text) : el.data
    return arguments.length > 1 ? (el[textContent] = text) : el[textContent]
  },
  focus(el) {
    el.focus()
  }
}

module.exports = dom

//====================== Query =============================
if (!document.querySelectorAll) {
  document.querySelectorAll = function querySelectorAll(selector) {
    let doc = document,
      head = doc.documentElement.firstChild,
      styleTag = doc.createElement('STYLE')

    head.appendChild(styleTag)
    doc.__qsaels = []
    if (styleTag.styleSheet) { // for IE
      styleTag.styleSheet.cssText = selector + '{x:expression(document.__qsaels.push(this))}'
    } else { // others
      let textnode = document.createTextNode(selector + '{x:expression(document.__qsaels.push(this))}')
      styleTag.appendChild(textnode)
    }
    window.scrollBy(0, 0)
    return doc.__qsaels
  }
}
if (!document.querySelector) {
  document.querySelector = function querySelector(selectors) {
    let elements = document.querySelectorAll(selectors)
    return elements.length ? elements[0] : null
  }
}
