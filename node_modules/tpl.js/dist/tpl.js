/*!
 * tpl.js v0.0.14 built in Thu, 07 Jul 2016 10:39:54 GMT
 * Copyright (c) 2016 Tao Zeng <tao.zeng.zt@gmail.com>
 * Based on observer.js v0.2.x
 * Released under the MIT license
 * support IE6+ and other browsers
 * support ES6 Proxy and Object.observe
 * https://github.com/tao-zeng/tpl.js
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("observer"));
	else if(typeof define === 'function' && define.amd)
		define(["observer"], factory);
	else if(typeof exports === 'object')
		exports["tpl"] = factory(require("observer"));
	else
		root["tpl"] = factory(root["observer"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_3__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "http://localhost:8088/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var tpl = __webpack_require__(1),
	    observer = __webpack_require__(3),
	    _ = __webpack_require__(2),
	    cfg = __webpack_require__(21);
	
	_.assign(tpl, _, __webpack_require__(4), {
	  filter: __webpack_require__(20),
	  expression: __webpack_require__(19),
	  Directive: __webpack_require__(12).Directive,
	  directives: __webpack_require__(22),
	  config: cfg,
	  init: function init(config) {
	    observer.init(config);
	    if (config) _.each(cfg, function (val, key) {
	      if (_.hasOwnProp(config, key)) cfg[key] = config[key];
	    });
	  }
	});
	module.exports = tpl;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var _ = __webpack_require__(2),
	    dom = __webpack_require__(4),
	    TemplateInstance = __webpack_require__(11);
	
	var parseDelimiterReg = function parseDelimiterReg(delimiter) {
	  return new RegExp([delimiter[0], '([^', delimiter[0], ']*)', delimiter[1]].join(''), 'g');
	},
	    parseDirectiveReg = function parseDirectiveReg(prefix) {
	  return new RegExp('^' + prefix);
	},
	    defaultCfg = {
	  delimiter: ['{', '}'],
	  directivePrefix: 'tpl-'
	};
	
	var Template = function () {
	  function Template(templ) {
	    var cfg = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	    _classCallCheck(this, Template);
	
	    var el = document.createElement('div');
	    if (typeof templ == 'string') {
	      templ = _.trim(templ);
	      if (templ.charAt(0) == '<') el.innerHTML = templ;else dom.append(el, dom.query(templ));
	    } else {
	      dom.append(el, templ);
	    }
	    this.el = el;
	    this.directivePrefix = cfg.directivePrefix || defaultCfg.directivePrefix;
	    this.delimiter = cfg.delimiter || defaultCfg.delimiter;
	    this.directiveReg = parseDirectiveReg(this.directivePrefix);
	    this.delimiterReg = parseDelimiterReg(this.delimiter);
	  }
	
	  Template.prototype.complie = function complie(scope) {
	    return new TemplateInstance(dom.cloneNode(this.el), scope, this.delimiterReg, this.directiveReg);
	  };
	
	  return Template;
	}();
	
	module.exports = Template;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var observer = __webpack_require__(3),
	    _ = observer.util,
	    regHump = /(^[a-z])|([_-][a-zA-Z])/g;
	
	function _hump(k) {
	    if (k[0] == '_' || k[0] == '-') k = k[1];
	    return k.toUpperCase();
	}
	
	module.exports = _.assignIf({
	    YieId: _.dynamicClass({
	        constructor: function constructor() {
	            this.doned = false;
	            this.thens = [];
	        },
	        then: function then(callback) {
	            if (this.doned) callback();else this.thens.push(callback);
	        },
	        done: function done() {
	            if (!this.doned) {
	                var thens = this.thens;
	                for (var i = 0, l = thens.length; i < l; i++) {
	                    thens[i]();
	                }
	                this.doned = true;
	            }
	        },
	        isDone: function isDone() {
	            return this.doned;
	        }
	    }),
	    eq: observer.eq,
	    obj: observer.obj,
	    proxy: observer.proxy,
	    Logger: observer.Logger,
	    logger: observer.logger,
	    timeoutframe: observer.timeoutframe,
	    observe: observer.on,
	    unobserve: observer.un,
	    isObserved: observer.hasListen,
	    hump: function hump(str) {
	        return str.replace(regHump, _hump);
	    }
	}, _);

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var dom = __webpack_require__(5);
	__webpack_require__(6);
	__webpack_require__(7);
	__webpack_require__(8);
	__webpack_require__(9);
	__webpack_require__(10);
	module.exports = dom;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(2),
	    textContent = typeof document.createElement('div').textContent == 'string' ? 'textContent' : 'innerText';
	
	var dom = {
	  W3C: !!window.dispatchEvent,
	  inDoc: function inDoc(el, root) {
	    root = root || document.documentElement;
	    if (root.contains) return root.contains(el);
	    try {
	      while (el = el.parentNode) {
	        if (el === root) return true;
	      }
	    } catch (e) {}
	    return false;
	  },
	  query: function query(selectors, all) {
	    if (_.isString(selectors)) return all ? document.querySelectorAll(selectors) : document.querySelector(selectors);
	    return selectors;
	  },
	  cloneNode: function cloneNode(el, deep) {
	    function clone(el) {
	      return el.cloneNode(deep !== false);
	    }
	    return _.isArrayLike(el) ? _.map(el, clone) : clone(el);
	  },
	  remove: function remove(el) {
	    function remove(el) {
	      if (el.parentNode) el.parentNode.removeChild(el);
	    }
	    _.isArrayLike(el) ? _.each(el, remove) : remove(el);
	  },
	  before: function before(el, target) {
	    if (_.isArrayLike(target)) target = target[0];
	
	    var parent = target.parentNode;
	
	    function before(el) {
	      parent.insertBefore(el, target);
	    }
	    _.isArrayLike(el) ? _.each(el, before) : before(el);
	  },
	  after: function after(el, target) {
	    if (_.isArrayLike(target)) target = target[target.length - 1];
	
	    var parent = target.parentNode,
	        apply = parent.lastChild === target ? function (el) {
	      parent.appendChild(el);
	    } : function () {
	      var next = target.nextSibling;
	
	      return function (el) {
	        parent.insertBefore(el, next);
	      };
	    }();
	    _.isArrayLike(el) ? _.each(el, apply) : apply(el);
	  },
	  append: function append(target, el) {
	    function append(el) {
	      target.appendChild(el);
	    }
	    _.isArrayLike(el) ? _.each(el, append) : append(el);
	  },
	  prepend: function prepend(target, el) {
	    target.firstChild ? dom.before(el, el.firstChild) : dom.append(target, el);
	  },
	  html: function html(el, _html) {
	    return arguments.length > 1 ? el.innerHTML = _html : el.innerHTML;
	  },
	  outerHtml: function outerHtml(el) {
	    if (el.outerHTML) return el.outerHTML;
	
	    var container = document.createElement('div');
	    container.appendChild(el.cloneNode(true));
	    return container.innerHTML;
	  },
	  text: function text(el, _text) {
	    if (el.nodeType == 3) return arguments.length > 1 ? el.data = _text : el.data;
	    return arguments.length > 1 ? el[textContent] = _text : el[textContent];
	  },
	  focus: function focus(el) {
	    el.focus();
	  }
	};
	
	module.exports = dom;
	
	//====================== Query =============================
	if (!document.querySelectorAll) {
	  document.querySelectorAll = function querySelectorAll(selector) {
	    var doc = document,
	        head = doc.documentElement.firstChild,
	        styleTag = doc.createElement('STYLE');
	
	    head.appendChild(styleTag);
	    doc.__qsaels = [];
	    if (styleTag.styleSheet) {
	      // for IE
	      styleTag.styleSheet.cssText = selector + '{x:expression(document.__qsaels.push(this))}';
	    } else {
	      // others
	      var textnode = document.createTextNode(selector + '{x:expression(document.__qsaels.push(this))}');
	      styleTag.appendChild(textnode);
	    }
	    window.scrollBy(0, 0);
	    return doc.__qsaels;
	  };
	}
	if (!document.querySelector) {
	  document.querySelector = function querySelector(selectors) {
	    var elements = document.querySelectorAll(selectors);
	    return elements.length ? elements[0] : null;
	  };
	}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(2),
	    dom = __webpack_require__(5),
	    rfocusable = /^(?:input|select|textarea|button|object)$/i,
	    rclickable = /^(?:a|area)$/i;
	
	_.assign(dom, {
	  prop: function prop(el, name, value) {
	    name = dom.propFix[name] || name;
	    var hook = dom.propHooks[name];
	
	    if (arguments.length > 2) return hook && hook.set ? hook.set(el, name, value) : el[name] = value;
	    return hook && hook.get ? hook.get(el, name) : el[name];
	  },
	  attr: function attr(el, name, val) {
	    return arguments.length > 2 ? el.setAttribute(name, val) : el.getAttribute(name);
	  },
	  removeAttr: function removeAttr(el, name) {
	    return el.removeAttribute(name);
	  },
	  checked: function checked(el, check) {
	    return _prop(el, 'checked', arguments.length > 1, check);
	  },
	  'class': function _class(el, cls) {
	    return _prop(el, 'class', arguments.length > 1, cls);
	  },
	  addClass: function addClass(el, cls) {
	    if (el.classList) {
	      el.classList.add(cls);
	    } else {
	      var cur = ' ' + dom.prop(el, 'class') + ' ';
	      if (cur.indexOf(' ' + cls + ' ') === -1) dom['class'](el, _.trim(cur + cls));
	    }
	  },
	  removeClass: function removeClass(el, cls) {
	    el.classList ? el.classList.remove(cls) : dom['class'](el, _.trim((' ' + dom.prop(el, 'class') + ' ').replace(new RegExp(' ' + cls + ' ', 'g'), '')));
	  },
	  style: function style(el, _style) {
	    return _prop(el, 'style', arguments.length > 1, _style);
	  },
	
	  propHooks: {
	    tabIndex: {
	      get: function get(elem) {
	        var attributeNode = elem.getAttributeNode('tabindex');
	
	        return attributeNode && attributeNode.specified ? parseInt(attributeNode.value, 10) : rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href ? 0 : undefined;
	      }
	    }
	  },
	  propFix: {
	    tabindex: 'tabIndex',
	    readonly: 'readOnly',
	    'for': 'htmlFor',
	    'class': 'className',
	    maxlength: 'maxLength',
	    cellspacing: 'cellSpacing',
	    cellpadding: 'cellPadding',
	    rowspan: 'rowSpan',
	    colspan: 'colSpan',
	    usemap: 'useMap',
	    frameborder: 'frameBorder',
	    contenteditable: 'contentEditable'
	  }
	});
	
	function _prop(el, name, set, val) {
	  return set ? dom.prop(el, name, val) : dom.prop(el, name);
	}
	
	module.exports = dom;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(2),
	    dom = __webpack_require__(5);
	
	_.assign(dom, {
	  css: function css(el, name, value) {
	    var prop = /[_-]/.test(name) ? camelize(name) : name,
	        hook = void 0;
	
	    name = cssName(prop) || prop;
	    hook = cssHooks[prop] || cssDefaultHook;
	    if (arguments.length == 2) {
	      var convert = value,
	          num = void 0;
	
	      if (name === 'background') name = 'backgroundColor';
	      value = hook.get(el, name);
	      return convert !== false && isFinite(num = parseFloat(value)) ? num : value;
	    } else if (!value && value !== 0) {
	      el.style[name] = '';
	    } else {
	      if (isFinite(value) && !cssNumber[prop]) value += 'px';
	      hook.set(el, name, value);
	    }
	  },
	
	  position: function position(el) {
	    var _offsetParent = void 0,
	        _offset = void 0,
	        parentOffset = {
	      top: 0,
	      left: 0
	    };
	    if (dom.css(el, 'position') === 'fixed') {
	      _offset = el.getBoundingClientRect();
	    } else {
	      _offsetParent = offsetParent(el);
	      _offset = offset(el);
	      if (_offsetParent.tagName !== 'HTML') parentOffset = offset(_offsetParent);
	      parentOffset.top += dom.css(_offsetParent, 'borderTopWidth', true);
	      parentOffset.left += dom.css(_offsetParent, 'borderLeftWidth', true);
	
	      parentOffset.top -= dom.scrollTop(_offsetParent);
	      parentOffset.left -= dom.scrollLeft(_offsetParent);
	    }
	    return {
	      top: _offset.top - parentOffset.top - dom.css(el, 'marginTop', true),
	      left: _offset.left - parentOffset.left - dom.css(el, 'marginLeft', true)
	    };
	  },
	  scrollTop: function scrollTop(el, val) {
	    var win = getWindow(el);
	    if (arguments.length == 1) {
	      return (win ? 'scrollTop' in win ? win.scrollTop : root.pageYOffset : el.pageYOffset) || 0;
	    } else if (win) {
	      win.scrollTo(dom.scrollLeft(el), val);
	    } else {
	      el.pageYOffset = val;
	    }
	  },
	  scrollLeft: function scrollLeft(el, val) {
	    var win = getWindow(el);
	    if (arguments.length == 1) {
	      return (win ? 'scrollLeft' in win ? win.scrollLeft : root.pageXOffset : el.pageXOffset) || 0;
	    } else if (win) {
	      win.scrollTo(val, dom.scrollTop(el));
	    } else {
	      el.pageXOffset = val;
	    }
	  },
	  scroll: function scroll(el, left, top) {
	    var win = getWindow(el);
	    if (arguments.length == 1) {
	      return {
	        left: dom.scrollLeft(el),
	        top: dom.scrollTop(el)
	      };
	    } else if (win) {
	      win.scrollTo(left, top);
	    } else {
	      el.pageXOffset = left;
	      el.pageYOffset = top;
	    }
	  }
	});
	
	module.exports = dom;
	
	var cssFix = dom.cssFix = {
	  'float': dom.W3C ? 'cssFloat' : 'styleFloat'
	},
	    cssHooks = dom.cssHooks = {},
	    cssDefaultHook = {},
	    prefixes = ['', '-webkit-', '-o-', '-moz-', '-ms-'],
	    cssNumber = {
	  animationIterationCount: true,
	  columnCount: true,
	  order: true,
	  flex: true,
	  flexGrow: true,
	  flexShrink: true,
	  fillOpacity: true,
	  fontWeight: true,
	  lineHeight: true,
	  opacity: true,
	  orphans: true,
	  widows: true,
	  zIndex: true,
	  zoom: true
	},
	    cssShow = {
	  position: 'absolute',
	  visibility: 'hidden',
	  display: 'block'
	},
	    rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	    root = document.documentElement,
	    css = dom.css;
	
	function camelize(target) {
	  if (!target || target.indexOf('-') < 0 && target.indexOf('_') < 0) {
	    return target;
	  }
	  return target.replace(/[-_][^-_]/g, function (match) {
	    return match.charAt(1).toUpperCase();
	  });
	}
	function cssName(name, host, camelCase) {
	  if (cssFix[name]) return cssFix[name];
	  host = host || root.style;
	  for (var i = 0, n = prefixes.length; i < n; i++) {
	    camelCase = camelize(prefixes[i] + name);
	    if (camelCase in host) {
	      return cssFix[name] = camelCase;
	    }
	  }
	  return null;
	}
	cssDefaultHook.set = function cssDefaultSet(el, name, value) {
	  try {
	    el.style[name] = value;
	  } catch (e) {}
	};
	
	var cssDefaultGet = void 0;
	if (window.getComputedStyle) {
	  cssDefaultGet = cssDefaultHook.get = function cssDefaultGet(el, name) {
	    var val = void 0,
	        styles = getComputedStyle(el, null);
	
	    if (styles) {
	      val = name === 'filter' ? styles.getPropertyValue(name) : styles[name];
	      if (val === '') val = el.style[name];
	    }
	    return val;
	  };
	  cssHooks.opacity = {
	    get: function get(el, name) {
	      var val = cssDefaultGet(el, name);
	      return val === '' ? '1' : ret;
	    }
	  };
	} else {
	  (function () {
	    var rnumnonpx = /^-?(?:\d*\.)?\d+(?!px)[^\d\s]+$/i,
	        rposition = /^(top|right|bottom|left)$/,
	        ralpha = /alpha\([^)]*\)/i,
	        ie8 = !!window.XDomainRequest,
	        salpha = 'DXImageTransform.Microsoft.Alpha',
	        border = {
	      thin: ie8 ? '1px' : '2px',
	      medium: ie8 ? '3px' : '4px',
	      thick: ie8 ? '5px' : '6px'
	    };
	
	    cssDefaultGet = cssDefaultHook.get = function cssDefaultGet(el, name) {
	      var currentStyle = el.currentStyle,
	          val = currentStyle[name];
	
	      if (rnumnonpx.test(val) && !rposition.test(val)) {
	        var style = el.style,
	            left = style.left,
	            rsLeft = el.runtimeStyle.left;
	
	        el.runtimeStyle.left = currentStyle.left;
	        style.left = name === 'fontSize' ? '1em' : val || 0;
	        val = style.pixelLeft + 'px';
	        style.left = left;
	        el.runtimeStyle.left = rsLeft;
	      }
	      if (val === 'medium') {
	        name = name.replace('Width', 'Style');
	        if (currentStyle[name] === 'none') val = '0px';
	      }
	      return val === '' ? 'auto' : border[val] || val;
	    };
	    cssHooks.opacity = {
	      get: function get(el, name) {
	        var alpha = el.filters.alpha || el.filters[salpha],
	            op = alpha && alpha.enabled ? alpha.opacity : 100;
	
	        return op / 100 + '';
	      },
	      set: function set(el, name, value) {
	        var style = el.style,
	            opacity = isFinite(value) && value <= 1 ? 'alpha(opacity=' + value * 100 + ')' : '',
	            filter = style.filter || '';
	
	        style.zoom = 1;
	        style.filter = (ralpha.test(filter) ? filter.replace(ralpha, opacity) : filter + ' ' + opacity).trim();
	        if (!style.filter) style.removeAttribute('filter');
	      }
	    };
	  })();
	}
	
	_.each(['top', 'left'], function (name) {
	  cssHooks[name] = {
	    get: function get(el, name) {
	      var val = cssDefaultGet(el, name);
	      return (/px$/.test(val) ? val : dom.position(el)[name] + 'px'
	      );
	    }
	  };
	});
	
	_.each(['Width', 'Height'], function (name) {
	  var method = name.toLowerCase(),
	      clientProp = 'client' + name,
	      scrollProp = 'scroll' + name,
	      offsetProp = 'offset' + name,
	      which = name == 'Width' ? ['Left', 'Right'] : ['Top', 'Bottom'];
	
	  function get(el, boxSizing) {
	    var val = void 0;
	
	    val = el[offsetProp]; // border-box 0
	    if (boxSizing === 2) // margin-box 2
	      return val + css(el, 'margin' + which[0], true) + css(el, 'margin' + which[1], true);
	    if (boxSizing < 0) // padding-box  -2
	      val = val - css(el, 'border' + which[0] + 'Width', true) - css(el, 'border' + which[1] + 'Width', true);
	    if (boxSizing === -4) // content-box -4
	      val = val - css(el, 'padding' + which[0], true) - css(el, 'padding' + which[1], true);
	    return val;
	  }
	
	  dom[method] = function (el) {
	    return get(el, -4);
	  };
	
	  dom['inner' + name] = function (el) {
	    return get(el, -2);
	  };
	  dom['outer' + name] = function (el, includeMargin) {
	    return get(el, includeMargin === true ? 2 : 0);
	  };
	});
	
	function offsetParent(el) {
	  var offsetParent = el.offsetParent;
	  while (offsetParent && css(offsetParent, "position") === "static") {
	    offsetParent = offsetParent.offsetParent;
	  }
	  return offsetParent || root;
	}
	
	function offset(el) {
	  //取得距离页面左右角的坐标
	  var box = {
	    left: 0,
	    top: 0
	  };
	
	  if (!el || !el.tagName || !el.ownerDocument) return box;
	
	  var doc = el.ownerDocument,
	      body = doc.body,
	      root = doc.documentElement,
	      win = doc.defaultView || doc.parentWindow;
	
	  if (!dom.inDoc(el, root)) return box;
	
	  if (el.getBoundingClientRect) box = el.getBoundingClientRect();
	
	  var clientTop = root.clientTop || body.clientTop,
	      clientLeft = root.clientLeft || body.clientLeft,
	      scrollTop = Math.max(win.pageYOffset || 0, root.scrollTop, body.scrollTop),
	      scrollLeft = Math.max(win.pageXOffset || 0, root.scrollLeft, body.scrollLeft);
	  return {
	    top: box.top + scrollTop - clientTop,
	    left: box.left + scrollLeft - clientLeft
	  };
	}
	
	function getWindow(node) {
	  return node.window && node.document ? node : node.nodeType === 9 ? node.defaultView || node.parentWindow : false;
	}

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(2),
	    dom = __webpack_require__(5);
	
	function stringValue(val) {
	  if (_.isNil(val) || val === NaN) return '';
	  if (!_.isString(val)) return val + '';
	  return val;
	}
	
	module.exports = _.assign(dom, {
	  val: function val(el, _val) {
	    var hook = dom.valHooks[el.type || el.tagName.toLowerCase()];
	
	    if (arguments.length == 1) return hook && hook.get ? hook.get(el) : el.value || '';
	
	    return hook && hook.set ? hook.set(el, _val) : el.value = stringValue(_val);
	  },
	
	  valHooks: {
	    option: {
	      get: function get(el) {
	        var val = el.attributes.value;
	
	        return !val || val.specified ? el.value : el.text;
	      }
	    },
	
	    select: {
	      get: function get(el) {
	        var signle = el.type == 'select-one',
	            index = el.selectedIndex;
	
	        if (index < 0) return signle ? undefined : [];
	
	        var options = el.options,
	            option = void 0,
	            values = signle ? undefined : [];
	
	        for (var i = 0, l = options.length; i < l; i++) {
	          option = options[i];
	          if (option.selected || i == index) {
	            if (signle) return dom.val(option);
	            values.push(dom.val(option));
	          }
	        }
	        return values;
	      },
	      set: function set(el, value) {
	        var signle = el.type == 'select-one',
	            options = el.options,
	            option = void 0,
	            i = void 0,
	            l = void 0,
	            vl = void 0,
	            val = void 0;
	
	        el.selectedIndex = -1;
	
	        if (!_.isArray(value)) value = _.isNil(value) ? [] : [value];
	
	        if (vl = value.length) {
	          if (signle) vl = value.length = 1;
	
	          var map = _.reverseConvert(value, function () {
	            return false;
	          }),
	              nr = 0;
	
	          for (i = 0, l = options.length; i < l; i++) {
	            option = options[i];
	            val = dom.val(option);
	            if (_.isBoolean(map[val])) {
	              map[val] = option.selected = true;
	              if (++nr === vl) break;
	            }
	            value = _.keys(map, function (v) {
	              return v === true;
	            });
	          }
	        }
	        return signle ? value[0] : value;
	      }
	    }
	  }
	});

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var _ = __webpack_require__(2),
	    dom = __webpack_require__(5),
	    root = document.documentElement,
	    domReady = false;
	
	_.assign(dom, {
	  on: function on(el, type, cb, once) {
	    if (addListen(el, type, cb, once === true)) {
	      canBubbleUp[type] ? delegateEvent(type, cb) : bandEvent(el, type, cb);
	      return cb;
	    }
	    return false;
	  },
	  once: function once(el, type, cb) {
	    return dom.on(el, type, cb, true);
	  },
	  off: function off(el, type, cb) {
	    if (removeListen(el, type, cb)) {
	      canBubbleUp[type] ? undelegateEvent(type, cb) : unbandEvent(el, type, cb);
	      return cb;
	    }
	    return false;
	  },
	  dispatchEvent: function dispatchEvent(el, type, opts) {
	    var hackEvent = void 0;
	    if (document.createEvent) {
	      hackEvent = document.createEvent('Events');
	      hackEvent.initEvent(type, true, true, opts);
	      _.assign(hackEvent, opts);
	      el.dispatchEvent(hackEvent);
	    } else if (dom.inDoc(el)) {
	      //IE6-8触发事件必须保证在DOM树中,否则报'SCRIPT16389: 未指明的错误'
	      hackEvent = document.createEventObject();
	      _.assign(hackEvent, opts);
	      el.fireEvent('on' + type, hackEvent);
	    }
	    return hackEvent;
	  }
	});
	
	module.exports = dom;
	
	var mouseEventReg = /^(?:mouse|contextmenu|drag)|click/,
	    keyEventReg = /^key/,
	    eventProps = ['altKey', 'bubbles', 'cancelable', 'ctrlKey', 'currentTarget', 'propertyName', 'eventPhase', 'metaKey', 'relatedTarget', 'shiftKey', 'target', 'view', 'which'],
	    eventFixHooks = {},
	    keyEventFixHook = {
	  props: ['char', 'charCode', 'key', 'keyCode'],
	  fix: function fix(event, original) {
	    if (event.which == null) event.which = original.charCode != null ? original.charCode : original.keyCode;
	  }
	},
	    mouseEventFixHook = {
	  props: ['button', 'buttons', 'clientX', 'clientY', 'offsetX', 'offsetY', 'pageX', 'pageY', 'screenX', 'screenY', 'toElement'],
	  fix: function fix(event, original) {
	    var eventDoc,
	        doc,
	        body,
	        button = original.button;
	
	    if (event.pageX == null && original.clientX != null) {
	      eventDoc = event.target.ownerDocument || document;
	      doc = eventDoc.documentElement;
	      body = eventDoc.body;
	      event.pageX = original.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
	      event.pageY = original.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
	    }
	    if (!event.which && button !== undefined) event.which = button & 1 ? 1 : button & 2 ? 3 : button & 4 ? 2 : 0;
	  }
	};
	
	var Event = function () {
	  function Event(event) {
	    _classCallCheck(this, Event);
	
	    var type = event.type,
	        fixHook = eventFixHooks[type],
	        i = void 0,
	        prop = void 0;
	
	    this.originalEvent = event;
	    this.type = event.type;
	    this.returnValue = !(event.defaultPrevented || event.returnValue === false || event.getPreventDefault && event.getPreventDefault());
	    this.timeStamp = event && event.timeStamp || new Date() + 0;
	
	    i = eventProps.length;
	    while (i--) {
	      prop = eventProps[i];
	      this[prop] = event[prop];
	    }
	
	    if (!fixHook) eventFixHooks[type] = fixHook = mouseEventReg.test(type) ? mouseEventFixHook : keyEventReg.test(type) ? keyEventFixHook : {};
	
	    if (fixHook.props) {
	      var props = fixHook.props;
	      i = props.length;
	      while (i--) {
	        prop = props[i];
	        this[prop] = event[prop];
	      }
	    }
	
	    if (!this.target) this.target = event.srcElement || document;
	    if (this.target.nodeType == 3) this.target = this.target.parentNode;
	
	    if (fixHook.fix) fixHook.fix(this, event);
	  }
	
	  Event.prototype.preventDefault = function preventDefault() {
	    var e = this.originalEvent;
	    this.returnValue = false;
	    if (e) {
	      e.returnValue = false;
	      if (e.preventDefault) e.preventDefault();
	    }
	  };
	
	  Event.prototype.stopPropagation = function stopPropagation() {
	    var e = this.originalEvent;
	    this.cancelBubble = true;
	    if (e) {
	      e.cancelBubble = true;
	      if (e.stopPropagation) e.stopPropagation();
	    }
	  };
	
	  Event.prototype.stopImmediatePropagation = function stopImmediatePropagation() {
	    var e = this.originalEvent;
	    this.isImmediatePropagationStopped = true;
	    if (e.stopImmediatePropagation) e.stopImmediatePropagation();
	    this.stopPropagation();
	  };
	
	  return Event;
	}();
	
	var listenKey = '__LISTEN__';
	
	function addListen(el, type, handler, once) {
	  if (!_.isFunc(handler)) throw TypeError('Invalid Event Handler');
	
	  var listens = el[listenKey],
	      handlers = void 0;
	
	  if (!listens) el[listenKey] = listens = {};
	
	  if (!(handlers = listens[type])) listens[type] = handlers = [];
	
	  handlers.push({
	    handler: handler,
	    once: once
	  });
	  return handlers.length === 1;
	}
	
	function removeListen(el, type, handler) {
	  var listens = el[listenKey],
	      handlers = listens ? listens[type] : undefined;
	
	  if (handlers) {
	    for (var i = 0, l = handlers.length; i < l; i++) {
	      if (handlers[i].handler === handler) {
	        handlers.splice(i, 1);
	        return l === 1;
	      }
	    }
	  }
	  return false;
	}
	
	function getListens(el, type) {
	  var listens = el[listenKey],
	      handlers = listens ? listens[type] : undefined;
	
	  return handlers ? handlers.slice() : undefined;
	}
	
	function hasListen(el, type) {
	  var listens = el[listenKey],
	      handlers = listens ? listens[type] : undefined;
	
	  return handlers ? !!handlers.length : false;
	}
	
	var bind = dom.W3C ? function (el, type, fn, capture) {
	  el.addEventListener(type, fn, capture);
	} : function (el, type, fn) {
	  el.attachEvent('on' + type, fn);
	},
	    unbind = dom.W3C ? function (el, type, fn) {
	  el.removeEventListener(type, fn);
	} : function (el, type, fn) {
	  el.detachEvent('on' + type, fn);
	},
	    canBubbleUpArray = ['click', 'dblclick', 'keydown', 'keypress', 'keyup', 'mousedown', 'mousemove', 'mouseup', 'mouseover', 'mouseout', 'wheel', 'mousewheel', 'input', 'change', 'beforeinput', 'compositionstart', 'compositionupdate', 'compositionend', 'select', 'cut', 'copy', 'paste', 'beforecut', 'beforecopy', 'beforepaste', 'focusin', 'focusout', 'DOMFocusIn', 'DOMFocusOut', 'DOMActivate', 'dragend', 'datasetchanged'],
	    canBubbleUp = {},
	    focusBlur = {
	  focus: true,
	  blur: true
	},
	    eventHooks = {},
	    eventHookTypes = {},
	    delegateEvents = {};
	
	_.each(canBubbleUpArray, function (name) {
	  canBubbleUp[name] = true;
	});
	if (!dom.W3C) {
	  delete canBubbleUp.change;
	  delete canBubbleUp.select;
	}
	
	function bandEvent(el, type, cb) {
	  var hook = eventHooks[type];
	  if (!hook || !hook.bind || hook.bind(el, type, cb) !== false) bind(el, hook ? hook.type || type : type, dispatch, !!focusBlur[type]);
	}
	
	function unbandEvent(el, type, cb) {
	  var hook = eventHooks[type];
	  if (!hook || !hook.unbind || hook.unbind(el, type, cb) !== false) unbind(el, hook ? hook.type || type : type, dispatch);
	}
	
	function delegateEvent(type, cb) {
	  if (!delegateEvents[type]) {
	    bandEvent(root, type, cb);
	    delegateEvents[type] = 1;
	  } else {
	    delegateEvents[type]++;
	  }
	}
	
	function undelegateEvent(type, cb) {
	  if (delegateEvents[type]) {
	    delegateEvents[type]--;
	    if (!delegateEvents[type]) unbandEvent(root, type, cb);
	  }
	}
	
	var last = new Date();
	
	function dispatchElement(el, event, isMove) {
	  var handlers = getListens(el, event.type);
	
	  if (handlers) {
	    event.currentTarget = el;
	    var handler = void 0,
	        i = void 0,
	        l = void 0;
	    for (i = 0, l = handlers.length; i < l && !event.isImmediatePropagationStopped; i++) {
	      handler = handlers[i];
	      if (isMove) {
	        var now = new Date();
	        if (now - last > 16) {
	          handler.handler.call(el, event);
	          last = now;
	        }
	      } else handler.handler.call(el, event);
	
	      if (handler.once) dom.off(el, event.type, handler.handler);
	    }
	  }
	}
	
	function dispatchEvent(el, type, event) {
	  if (el.disabled !== true || type !== 'click') {
	    var isMove = /move|scroll/.test(type);
	    if (canBubbleUp[type]) {
	      while (el && el.getAttribute && !event.cancelBubble) {
	        dispatchElement(el, event, isMove);
	        el = el.parentNode;
	      }
	    } else dispatchElement(el, event, isMove);
	  }
	}
	
	function dispatch(event) {
	  event = new Event(event);
	  var type = event.type,
	      el = event.target;
	  if (eventHookTypes[type]) {
	    type = eventHookTypes[type];
	    var hook = eventHooks[type];
	    if (hook && hook.fix && hook.fix(el, event) === false) return;
	    event.type = type;
	    dispatchEvent(el, type, event);
	  } else {
	    dispatchEvent(el, type, event);
	  }
	}
	
	//针对firefox, chrome修正mouseenter, mouseleave
	if (!('onmouseenter' in root)) {
	  _.each({
	    mouseenter: 'mouseover',
	    mouseleave: 'mouseout'
	  }, function (origType, fixType) {
	    eventHooks[origType] = {
	      type: fixType,
	      fix: function fix(elem, event, fn) {
	        var t = event.relatedTarget;
	        return !t || t !== elem && !(elem.compareDocumentPosition(t) & 16);
	      }
	    };
	  });
	}
	//针对IE9+, w3c修正animationend
	_.each({
	  AnimationEvent: 'animationend',
	  WebKitAnimationEvent: 'webkitAnimationEnd'
	}, function (construct, fixType) {
	  if (window[construct] && !eventHooks.animationend) {
	    eventHooks.animationend = {
	      type: fixType
	    };
	  }
	});
	
	//针对IE6-8修正input
	if (!('oninput' in document.createElement('input'))) {
	  delete canBubbleUp.input;
	  eventHooks.input = {
	    type: 'propertychange',
	    fix: function fix(elem, event) {
	      return event.propertyName == 'value';
	    }
	  };
	  eventHooks.change = {
	    bind: function bind(elem) {
	      if (elem.type == 'checkbox' || elem.type == 'radio') {
	        if (!elem.$onchange) {
	          elem.$onchange = function (event) {
	            event.type = 'change';
	            dispatchEvent(elem, 'change', event);
	          };
	          dom.on(elem, 'click', elem.$onchange);
	        }
	        return false;
	      }
	    },
	    unbind: function unbind(elem) {
	      if (elem.type == 'checkbox' || elem.type == 'radio') {
	        dom.off(elem, 'click', elem.$onchange);
	        return false;
	      }
	    }
	  };
	} else if (navigator.userAgent.indexOf('MSIE 9') !== -1) {
	  eventHooks.input = {
	    type: 'input',
	    fix: function fix(elem) {
	      elem.oldValue = elem.value;
	    }
	  };
	  // http://stackoverflow.com/questions/6382389/oninput-in-ie9-doesnt-fire-when-we-hit-backspace-del-do-cut
	  document.addEventListener('selectionchange', function (event) {
	    var actEl = document.activeElement;
	    if (actEl.tagName === 'TEXTAREA' || actEl.tagName === 'INPUT' && actEl.type === 'text') {
	      if (actEl.value == actEl.oldValue) return;
	      actEl.oldValue = actEl.value;
	      if (hasListen(actEl, 'input')) {
	        event = new Event(event);
	        event.type = 'input';
	        dispatchEvent(actEl, 'input', event);
	      }
	    }
	  });
	}
	
	if (document.onmousewheel === void 0) {
	  (function () {
	    /* IE6-11 chrome mousewheel wheelDetla 下 -120 上 120
	     firefox DOMMouseScroll detail 下3 上-3
	     firefox wheel detlaY 下3 上-3
	     IE9-11 wheel deltaY 下40 上-40
	     chrome wheel deltaY 下100 上-100 */
	    var fixWheelType = document.onwheel ? 'wheel' : 'DOMMouseScroll',
	        fixWheelDelta = fixWheelType === 'wheel' ? 'deltaY' : 'detail';
	    eventHooks.mousewheel = {
	      type: fixWheelType,
	      fix: function fix(elem, event) {
	        event.wheelDeltaY = event.wheelDelta = event[fixWheelDelta] > 0 ? -120 : 120;
	        event.wheelDeltaX = 0;
	        return true;
	      }
	    };
	  })();
	}
	_.each(eventHooks, function (hook, type) {
	  eventHookTypes[hook.type || type] = type;
	});

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var dom = __webpack_require__(9),
	    readyList = [],
	    isReady = void 0,
	    root = document.documentElement;
	
	function fireReady(fn) {
	  isReady = true;
	  while (fn = readyList.shift()) {
	    fn();
	  }
	}
	
	if (document.readyState === 'complete') {
	  setTimeout(fireReady);
	} else if (document.addEventListener) {
	  document.addEventListener('DOMContentLoaded', fireReady);
	} else if (document.attachEvent) {
	  document.attachEvent('onreadystatechange', function () {
	    if (document.readyState === 'complete') fireReady();
	  });
	  if (root.doScroll && window.frameElement === null && window.external) {
	    (function () {
	      var doScrollCheck = function doScrollCheck() {
	        try {
	          root.doScroll('left');
	          fireReady();
	        } catch (e) {
	          setTimeout(doScrollCheck);
	        }
	      };
	
	      doScrollCheck();
	    })();
	  }
	}
	
	dom.on(window, 'load', fireReady);
	
	dom.ready = function (fn) {
	  !isReady ? readyList.push(fn) : fn();
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var observer = __webpack_require__(3);
	var _ = __webpack_require__(2);
	var dom = __webpack_require__(4);
	
	var _require = __webpack_require__(12);
	
	var Text = _require.Text;
	var Directive = _require.Directive;
	var DirectiveGroup = _require.DirectiveGroup;
	
	
	function childNodes(el) {
	  return _.map(el.childNodes, function (n) {
	    return n;
	  });
	}
	
	var TemplateInstance = function () {
	  function TemplateInstance(el, scope, delimiterReg, directiveReg, autoBind) {
	    _classCallCheck(this, TemplateInstance);
	
	    this.delimiterReg = delimiterReg;
	    this.directiveReg = directiveReg;
	    this.scope = observer.proxy.proxy(scope) || scope;
	    this._scopeProxyListen = this._scopeProxyListen.bind(this);
	    observer.proxy.on(this.scope, this._scopeProxyListen);
	    this.bindings = this.parse(el, this);
	    this.binded = false;
	    this.bind();
	    this.els = childNodes(el);
	  }
	
	  TemplateInstance.prototype.parentEl = function parentEl() {
	    return this.els[0].parentNode;
	  };
	
	  TemplateInstance.prototype.before = function before(target) {
	    dom.before(this.els, dom.query(target));
	    return this;
	  };
	
	  TemplateInstance.prototype.after = function after(target) {
	    dom.after(this.els, dom.query(target));
	    return this;
	  };
	
	  TemplateInstance.prototype.prependTo = function prependTo(target) {
	    dom.prepend(dom.query(target), this.els);
	    return this;
	  };
	
	  TemplateInstance.prototype.appendTo = function appendTo(target) {
	    dom.append(dom.query(target), this.els);
	    return this;
	  };
	
	  TemplateInstance.prototype.bind = function bind() {
	    if (!this.binded) {
	      _.each(this.bindings, function (bind) {
	        bind.bind();
	      });
	      this.binded = true;
	    }
	    return this;
	  };
	
	  TemplateInstance.prototype.unbind = function unbind() {
	    if (this.binded) {
	      _.each(this.bindings, function (bind) {
	        bind.unbind();
	      });
	      this.binded = false;
	    }
	    return this;
	  };
	
	  TemplateInstance.prototype.destroy = function destroy() {
	    var _this = this;
	
	    observer.proxy.un(this.scope, this._scopeProxyListen);
	    _.each(this.bindings, function (bind) {
	      if (_this.binded) bind.unbind();
	      bind.destroy();
	    });
	    dom.remove(this.els);
	    this.bindings = undefined;
	    this.scope = undefined;
	  };
	
	  TemplateInstance.prototype._scopeProxyListen = function _scopeProxyListen(obj, proxy) {
	    this.scope = proxy || obj;
	  };
	
	  TemplateInstance.prototype.parse = function parse(els) {
	    var _this2 = this;
	
	    if (_.isArrayLike(els)) {
	      var _ret = function () {
	        var bindings = [];
	        _.each(els, function (el) {
	          bindings.push.apply(bindings, _this2.parseEl(el));
	        });
	        return {
	          v: bindings
	        };
	      }();
	
	      if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	    }
	    return this.parseEl(els);
	  };
	
	  TemplateInstance.prototype.parseEl = function parseEl(el) {
	    switch (el.nodeType) {
	      case 1:
	        return this.parseElement(el);
	      case 3:
	        return this.parseText(el);
	    }
	  };
	
	  TemplateInstance.prototype.parseText = function parseText(el) {
	    var text = el.data,
	        delimiterReg = this.delimiterReg,
	        token = void 0,
	        lastIndex = 0,
	        bindings = [];
	
	    while (token = delimiterReg.exec(text)) {
	
	      this.createTextNode2(text.substring(lastIndex, delimiterReg.lastIndex - token[0].length), el);
	
	      bindings.push(new Text(this.createTextNode('binding', el), this, token[1]));
	
	      lastIndex = delimiterReg.lastIndex;
	    }
	
	    if (bindings.length) {
	
	      this.createTextNode2(text.substr(lastIndex), el);
	
	      dom.remove(el);
	    }
	
	    return bindings;
	  };
	
	  TemplateInstance.prototype.parseElement = function parseElement(el) {
	    var block = false,
	        directives = [],
	        attributes = el.attributes,
	        attribute = void 0,
	        name = void 0,
	        directiveName = void 0,
	        directiveConst = void 0,
	        directiveConsts = [];
	
	    for (var i = 0, l = attributes.length; i < l; i++) {
	      attribute = attributes[i];
	      name = attribute.name;
	      directiveName = this.parseDirectiveName(name);
	      if (directiveName) {
	        directiveConst = Directive.getDirective(directiveName);
	        if (directiveConst) {
	          if (directiveConst.prototype.abstract) {
	            block = true;
	            directiveConsts = [{
	              'const': directiveConst,
	              expression: attribute.value,
	              attr: name
	            }];
	            break;
	          } else {
	            directiveConsts.push({
	              'const': directiveConst,
	              expression: attribute.value,
	              attr: name
	            });
	            if (directiveConst.prototype.block) block = true;
	          }
	        } else {
	          console.warn('Directive is undefined ' + name);
	        }
	      }
	    }
	    if (directiveConsts.length == 1) {
	      var cfg = directiveConsts[0];
	      directives.push(new cfg['const'](el, this, cfg.expression, cfg.attr));
	    } else if (directiveConsts.length) {
	      directives.push(new DirectiveGroup(el, this, directiveConsts));
	    }
	    if (!block) directives.push.apply(directives, this.parseChildNodes(el));
	    return directives;
	  };
	
	  TemplateInstance.prototype.parseChildNodes = function parseChildNodes(el) {
	    return this.parse(childNodes(el));
	  };
	
	  TemplateInstance.prototype.parseDirectiveName = function parseDirectiveName(name) {
	    var directiveName = name.replace(this.directiveReg, '');
	    return directiveName == name ? undefined : directiveName;
	  };
	
	  TemplateInstance.prototype.createTextNode = function createTextNode(content, before) {
	    var el = document.createTextNode(content);
	    dom.before(el, before);
	    return el;
	  };
	
	  TemplateInstance.prototype.createTextNode2 = function createTextNode2(content, before) {
	    if (content = _.trim(content)) return this.createTextNode(content, before);
	    return undefined;
	  };
	
	  return TemplateInstance;
	}();
	
	module.exports = TemplateInstance;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(2);
	
	_.each(['abstractBinding', 'binding', 'text', 'directive', 'directiveGroup', 'text'], function (name) {
	  module.exports[_.upperFirst(name)] = __webpack_require__(13)("./" + name);
	});

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./abstractBinding": 14,
		"./abstractBinding.js": 14,
		"./binding": 15,
		"./binding.js": 15,
		"./directive": 16,
		"./directive.js": 16,
		"./directiveGroup": 17,
		"./directiveGroup.js": 17,
		"./index": 12,
		"./index.js": 12,
		"./text": 18,
		"./text.js": 18
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 13;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var _ = __webpack_require__(2),
	    proxy = _.proxy;
	
	var AbstractBinding = function () {
	  function AbstractBinding(tpl) {
	    _classCallCheck(this, AbstractBinding);
	
	    this.tpl = tpl;
	    this.binded = false;
	  }
	
	  AbstractBinding.prototype.scope = function scope() {
	    return this.tpl.scope;
	  };
	
	  AbstractBinding.prototype.realScope = function realScope() {
	    return _.obj(this.tpl.scope);
	  };
	
	  AbstractBinding.prototype.propScope = function propScope(prop) {
	    var scope = this.tpl.scope,
	        parent = scope.$parent;
	
	    if (!parent) return scope;
	
	    while (parent && !_.hasOwnProp(scope, prop)) {
	      scope = parent;
	      parent = scope.$parent;
	    }
	    return proxy.proxy(scope) || scope;
	  };
	
	  AbstractBinding.prototype.exprScope = function exprScope(expr) {
	    var scope = this.tpl.scope,
	        parent = scope.$parent,
	        prop = void 0;
	
	    if (!parent) return scope;
	
	    prop = _.parseExpr(expr)[0];
	    while (parent && !_.hasOwnProp(scope, prop)) {
	      scope = parent;
	      parent = scope.$parent;
	    }
	    return proxy.proxy(scope) || scope;
	  };
	
	  AbstractBinding.prototype.observe = function observe(expr, callback) {
	    _.observe(this.exprScope(expr), expr, callback);
	  };
	
	  AbstractBinding.prototype.unobserve = function unobserve(expr, callback) {
	    _.unobserve(this.exprScope(expr), expr, callback);
	  };
	
	  AbstractBinding.prototype.get = function get(expr) {
	    return _.get(this.tpl.scope, expr);
	  };
	
	  AbstractBinding.prototype.has = function has(expr) {
	    return _.has(this.tpl.scope, expr);
	  };
	
	  AbstractBinding.prototype.set = function set(expr, value) {
	    _.set(this.tpl.scope, expr, value);
	  };
	
	  AbstractBinding.prototype.bind = function bind() {};
	
	  AbstractBinding.prototype.unbind = function unbind() {};
	
	  AbstractBinding.prototype.destroy = function destroy() {};
	
	  return AbstractBinding;
	}();
	
	module.exports = AbstractBinding;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var AbstractBinding = __webpack_require__(14);
	
	var Binding = function (_AbstractBinding) {
	  _inherits(Binding, _AbstractBinding);
	
	  function Binding(tpl, expr) {
	    _classCallCheck(this, Binding);
	
	    var _this = _possibleConstructorReturn(this, _AbstractBinding.call(this, tpl));
	
	    _this.expr = expr;
	    return _this;
	  }
	
	  return Binding;
	}(AbstractBinding);
	
	Binding.generateComments = true;
	
	module.exports = Binding;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _ = __webpack_require__(2),
	    dom = __webpack_require__(4),
	    Binding = __webpack_require__(15),
	    dynamicDirectiveOptions = {
	  extend: 'extend',
	  constructor: 'constructor'
	},
	    directives = {};
	
	var Directive = function (_Binding) {
	  _inherits(Directive, _Binding);
	
	  function Directive(el, tpl, expr, attr) {
	    _classCallCheck(this, Directive);
	
	    var _this = _possibleConstructorReturn(this, _Binding.call(this, tpl, expr));
	
	    _this.el = el;
	    _this.attr = attr;
	    dom.removeAttr(_this.el, _this.attr);
	    if (Binding.generateComments) {
	      _this.comment = document.createComment(' Directive:' + _this.name + ' [' + _this.expr + '] ');
	      dom.before(_this.comment, _this.el);
	    }
	    return _this;
	  }
	
	  return Directive;
	}(Binding);
	
	Directive.prototype.abstract = false;
	Directive.prototype.block = false;
	Directive.prototype.priority = 5;
	
	_.assign(Directive, {
	  getDirective: function getDirective(name) {
	    return directives[name];
	  },
	  isDirective: function isDirective(object) {
	    return _.isExtendOf(object, Directive);
	  },
	  register: function register(name, option) {
	    var directive = void 0;
	    if (_.isFunc(option)) {
	      if (!_.isExtendOf(option, Directive)) throw TypeError('Invalid Class Constructor, ' + option.name + ' is not extend of Directive');
	      directive = option;
	    } else {
	      directive = _.dynamicClass(option, Directive, dynamicDirectiveOptions);
	    }
	
	    if (!directive.className) directive.prototype.className = directive.className = _.hump(name) + 'Directive';
	
	    name = name.toLowerCase();
	
	    if (name in directives) console.warn('Directive[' + name + '] is defined');
	
	    directives[name] = directive;
	    return directive;
	  }
	});
	module.exports = Directive;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var AbstractBinding = __webpack_require__(14);
	
	var _require = __webpack_require__(2);
	
	var YieId = _require.YieId;
	
	var DirectiveGroup = function (_AbstractBinding) {
	  _inherits(DirectiveGroup, _AbstractBinding);
	
	  function DirectiveGroup(el, tpl, directiveConfigs) {
	    _classCallCheck(this, DirectiveGroup);
	
	    var _this = _possibleConstructorReturn(this, _AbstractBinding.call(this, tpl));
	
	    _this.el = el;
	    _this.directiveConfigs = directiveConfigs.sort(function (a, b) {
	      return b['const'].prototype.priority - a['const'].prototype.priority || 0;
	    });
	    _this.directives = [];
	    _this.bindedCount = 0;
	    return _this;
	  }
	
	  DirectiveGroup.prototype.bind = function bind() {
	    _AbstractBinding.prototype.bind.call(this);
	    var directives = this.directives,
	        directiveConfigs = this.directiveConfigs,
	        tpl = this.tpl,
	        el = this.el,
	        directiveCount = this.directiveConfigs.length,
	        self = this;
	    function parse() {
	      var idx = self.bindedCount,
	          directive = directives[idx],
	          ret = void 0;
	      if (!directive) {
	        var cfg = directiveConfigs[idx];
	        directive = directives[idx] = new cfg['const'](el, tpl, cfg.expression, cfg.attr);
	      }
	      ret = directive.bind();
	      if (++self.bindedCount < directiveCount) {
	        if (ret && ret instanceof YieId) ret.then(parse);else parse();
	      }
	    }
	    parse();
	  };
	
	  DirectiveGroup.prototype.unbind = function unbind() {
	    _AbstractBinding.prototype.unbind.call(this);
	    var directives = this.directives;
	    for (var i = 0, l = this.bindedCount; i < l; i++) {
	      directives[i].unbind();
	    }
	    this.bindedCount = 0;
	  };
	
	  return DirectiveGroup;
	}(AbstractBinding);
	
	module.exports = DirectiveGroup;

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _ = __webpack_require__(2),
	    dom = __webpack_require__(4),
	    expression = __webpack_require__(19),
	    Binding = __webpack_require__(15),
	    expressionArgs = ['$el'];
	
	var Text = function (_Binding) {
	  _inherits(Text, _Binding);
	
	  function Text(el, tpl, expr) {
	    _classCallCheck(this, Text);
	
	    var _this = _possibleConstructorReturn(this, _Binding.call(this, tpl, expr));
	
	    _this.el = el;
	    _this.observeHandler = _this.observeHandler.bind(_this);
	    _this.expression = expression.parse(_this.expr, expressionArgs);
	
	    if (Binding.generateComments) {
	      _this.comment = document.createComment('Text Binding ' + _this.expr);
	      dom.before(_this.comment, _this.el);
	    }
	    return _this;
	  }
	
	  Text.prototype.value = function value() {
	    return this.expression.executeAll.call(this, this.scope(), this.el);
	  };
	
	  Text.prototype.bind = function bind() {
	    var _this2 = this;
	
	    _Binding.prototype.bind.call(this);
	    _.each(this.expression.identities, function (ident) {
	      _this2.observe(ident, _this2.observeHandler);
	    });
	    this.update(this.value());
	  };
	
	  Text.prototype.unbind = function unbind() {
	    var _this3 = this;
	
	    _Binding.prototype.unbind.call(this);
	    _.each(this.expression.identities, function (ident) {
	      _this3.unobserve(ident, _this3.observeHandler);
	    });
	  };
	
	  Text.prototype.observeHandler = function observeHandler(attr, val) {
	    if (this.expression.simplePath) {
	      this.update(this.expression.applyFilter(val, this, [this.scope(), this.el]));
	    } else {
	      this.update(this.value());
	    }
	  };
	
	  Text.prototype.update = function update(val) {
	    if (_.isNil(val)) val = '';
	    if (val !== dom.text(this.el)) dom.text(this.el, val);
	  };
	
	  return Text;
	}(Binding);
	
	module.exports = Text;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.parse = parse;
	var _ = __webpack_require__(2),
	    filter = __webpack_require__(20),
	    defaultKeywords = _.reverseConvert('Math,Date,this,true,false,null,undefined,Infinity,NaN,isNaN,isFinite,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,parseInt,parseFloat,$scope'.split(','), function () {
	  return true;
	}),
	    wsReg = /\s/g,
	    newlineReg = /\n/g,
	    translationReg = /[\{,]\s*[\w\$_]+\s*:|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`)|new |typeof |void |(\|\|)/g,
	    translationRestoreReg = /"(\d+)"/g,
	    pathTestReg = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*$/,
	    booleanLiteralReg = /^(?:true|false)$/,
	    identityReg = /[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*[^\w$\.]/g,
	    propReg = /^[A-Za-z_$][\w$]*/;
	
	var translations = [];
	
	function translationProcessor(str, isString) {
	  var i = translations.length;
	  translations[i] = isString ? str.replace(newlineReg, '\\n') : str;
	  return '"' + i + '"';
	}
	
	function translationRestoreProcessor(str, i) {
	  return translations[i];
	}
	
	var currentIdentities = void 0,
	    currentKeywords = void 0,
	    prevPropScope = void 0;
	
	function identityProcessor(raw, idx, str) {
	  var l = raw.length,
	      suffix = raw.charAt(l - 1),
	      exp = raw.slice(0, l - 1),
	      prop = exp.match(propReg)[0];
	
	  if (defaultKeywords[prop] || currentKeywords[prop]) return raw;
	  if (prop === '$context') return raw.replace(propReg, prevPropScope);
	  if (suffix == '(') {
	    suffix = idx + l == str.length || str.charAt(idx + l) == ')' ? '' : ',';
	    prevPropScope = 'this.propScope(\'' + prop + '\')';
	    return '$scope.' + exp + '.call(' + prevPropScope + suffix;
	  }
	  currentIdentities[exp] = true;
	  return '$scope.' + exp + suffix;
	}
	
	function complileExpr(body) {
	  prevPropScope = undefined;
	  return (body + ' ').replace(identityReg, identityProcessor).replace(translationRestoreReg, translationRestoreProcessor);
	}
	
	function compileFilterArgs(argExprs, keywords) {
	  for (var i = 0, l = argExprs.length; i < l; i++) {
	    argExprs[i] = makeExecuter(complileExpr(argExprs[i]), keywords);
	  }
	  return argExprs;
	}
	
	function compileFilter(filterExprs, keywords) {
	  if (!filterExprs || !filterExprs.length) return [];
	
	  var filters = [],
	      filterExpr = void 0,
	      name = void 0,
	      argExprs = void 0;
	
	  for (var i = 0, l = filterExprs.length; i < l; i++) {
	    if (filterExpr = _.trim(filterExprs[i])) {
	      argExprs = filterExpr.replace(/,?\s+/g, ',').split(',');
	      filters.push({
	        name: argExprs.shift().replace(translationRestoreReg, translationRestoreProcessor),
	        args: compileFilterArgs(argExprs, keywords)
	      });
	    }
	  }
	  return filters;
	}
	
	function compileExecuter(exp, keywords) {
	  var filterExprs = void 0,
	      ret = void 0,
	      isSimple = isSimplePath(exp);
	
	  currentIdentities = {};
	  currentKeywords = keywords ? _.reverseConvert(keywords, function () {
	    return true;
	  }) : {};
	
	  if (!isSimple) {
	    filterExprs = exp.replace(translationReg, translationProcessor).split('|');
	    exp = filterExprs.shift().replace(wsReg, '');
	    isSimple = isSimplePath(exp);
	  }
	  if (isSimple) {
	    exp = exp.replace(translationRestoreReg, translationRestoreProcessor);
	    currentIdentities[exp] = true;
	    ret = {
	      execute: makeExecuter('$scope.' + exp, keywords),
	      path: _.parseExpr(exp),
	      expr: exp
	    };
	  } else {
	    ret = {
	      execute: makeExecuter(complileExpr(exp), keywords),
	      expr: exp
	    };
	  }
	  ret.filters = compileFilter(filterExprs, keywords);
	  ret.simplePath = isSimple;
	  ret.identities = _.keys(currentIdentities);
	
	  currentKeywords = undefined;
	  currentIdentities = undefined;
	  translations.length = 0;
	  ret.applyFilter = function (data, argScope, args, apply) {
	    var fs = ret.filters,
	        f = void 0,
	        _args = void 0,
	        rs = void 0;
	
	    for (var i = 0, l = fs.length; i < l; i++) {
	      f = fs[i];
	      _args = parseFilterArgs(f.args, argScope, args);
	      rs = (apply !== false ? filter.apply : filter.unapply)(f.name, data, _args);
	      if (rs.stop) {
	        return rs.data;
	      } else if (rs.replaceData) data = rs.data;
	    }
	    return data;
	  };
	  ret.executeAll = function () {
	    var val = ret.execute.apply(this, arguments);
	    val = ret.applyFilter(val, this, arguments);
	    return val;
	  };
	  return ret;
	}
	
	function parseFilterArgs(executors, scope, args) {
	  return _.map(executors, function (executor) {
	    return executor.apply(scope, args);
	  });
	}
	
	function makeExecuter(body, args) {
	  var _args = ['$scope'];
	
	  args = args ? _args.concat(args) : _args;
	  args.push('return ' + body + ';');
	  try {
	    return Function.apply(Function, args);
	  } catch (e) {
	    throw Error('Invalid expression. Generated function body: ' + body);
	  }
	}
	
	function isSimplePath(exp) {
	  return pathTestReg.test(exp) && !booleanLiteralReg.test(exp);
	}
	
	var cache = {};
	
	function parse(exp, args) {
	  exp = _.trim(exp);
	  var res = void 0;
	  if (res = cache[exp]) return res;
	  cache[exp] = res = compileExecuter(exp, args);
	  return res;
	}

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	var _ = __webpack_require__(2),
	    slice = Array.prototype.slice,
	    filters = {};
	
	function apply(name, data, args, apply) {
	  var f = filters[name],
	      type = f ? f.type : undefined,
	      fn = void 0;
	
	  fn = f ? apply !== false ? f.apply : f.unapply : undefined;
	  if (!fn) {
	    console.warn('filter[' + name + '].' + (apply !== false ? 'apply' : 'unapply') + ' is undefined');
	  } else {
	    if (_.isFunc(args)) args = args();
	    data = fn.apply(f, [data].concat(args));
	  }
	  return {
	    stop: type == 'event' && data === false,
	    data: data,
	    replaceData: type !== 'event'
	  };
	}
	var filter = {
	  register: function register(name, filter) {
	    if (filters[name]) throw Error('Filter is existing');
	    if (typeof filter == 'function') filter = {
	      apply: filter
	    };
	    filter.type = filter.type || 'normal';
	    filters[name] = filter;
	  },
	  get: function get(name) {
	    return filters[name];
	  },
	
	
	  apply: apply,
	
	  unapply: function unapply(name, data, args) {
	    return apply(name, data, args, false);
	  }
	};
	
	module.exports = filter;
	
	var keyCodes = exports.keyCodes = {
	  esc: 27,
	  tab: 9,
	  enter: 13,
	  space: 32,
	  'delete': [8, 46],
	  up: 38,
	  left: 37,
	  right: 39,
	  down: 40
	};
	
	var eventFilters = {
	  key: function key(e) {
	    var keys = slice.call(arguments, 1),
	        codes = {},
	        key = void 0;
	
	    for (var i = 0, l = keys.length; i < l; i++) {
	      key = keys[i];
	      codes[keyCodes[key] || key] = true;
	    }
	    return codes[e.which] || false;
	  },
	  stop: function stop(e) {
	    e.stopPropagation();
	  },
	  prevent: function prevent(e) {
	    e.preventDefault();
	  },
	  self: function self(e) {
	    return e.target === e.currentTarget;
	  }
	};
	
	_.each(eventFilters, function (fn, name) {
	  filter.register(name, {
	    type: 'event',
	    apply: fn
	  });
	});
	
	var nomalFilters = {
	  json: {
	    apply: function apply(value, indent) {
	      return typeof value === 'string' ? value : JSON.stringify(value, null, Number(indent) || 2);
	    },
	    unapply: function unapply(value) {
	      try {
	        return JSON.parse(value);
	      } catch (e) {
	        return value;
	      }
	    }
	  },
	
	  capitalize: function capitalize(value) {
	    if (!value && value !== 0) return '';
	    value = value.toString();
	    return value.charAt(0).toUpperCase() + value.slice(1);
	  },
	  uppercase: function uppercase(value) {
	    return value || value === 0 ? value.toString().toUpperCase() : '';
	  },
	  lowercase: function lowercase(value) {
	    return value || value === 0 ? value.toString().toLowerCase() : '';
	  },
	  currency: function currency(value, _currency) {
	    value = parseFloat(value);
	    if (!isFinite(value) || !value && value !== 0) return '';
	    _currency = _currency != null ? _currency : '$';
	    var stringified = Math.abs(value).toFixed(2);
	    var _int = stringified.slice(0, -3);
	    var i = _int.length % 3;
	    var head = i > 0 ? _int.slice(0, i) + (_int.length > 3 ? ',' : '') : '';
	    var _float = stringified.slice(-3);
	    var sign = value < 0 ? '-' : '';
	    return sign + _currency + head + _int.slice(i).replace(digitsRE, '$1,') + _float;
	  },
	  pluralize: function pluralize(value) {
	    var args = slice.call(arguments, 1);
	    return args.length > 1 ? args[value % 10 - 1] || args[args.length - 1] : args[0] + (value === 1 ? '' : 's');
	  }
	};
	_.each(nomalFilters, function (f, name) {
	  filter.register(name, f);
	});

/***/ },
/* 21 */
/***/ function(module, exports) {

	"use strict";
	
	module.exports = {
	  generateComments: true
	};

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(2);
	
	module.exports = _.assign({}, __webpack_require__(23), __webpack_require__(24), __webpack_require__(25));

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _ = __webpack_require__(2);
	var dom = __webpack_require__(4);
	
	var _require = __webpack_require__(12);
	
	var Directive = _require.Directive;
	var TemplateInstance = __webpack_require__(11);
	var eachReg = /^\s*([\s\S]+)\s+in\s+([\S]+)(\s+track\s+by\s+([\S]+))?\s*$/;
	var eachAliasReg = /^(\(\s*([^,\s]+)(\s*,\s*([\S]+))?\s*\))|([^,\s]+)(\s*,\s*([\S]+))?$/;
	
	var EachDirective = exports.EachDirective = function (_Directive) {
	  _inherits(EachDirective, _Directive);
	
	  function EachDirective(el, tpl, expr, attr) {
	    _classCallCheck(this, EachDirective);
	
	    var _this = _possibleConstructorReturn(this, _Directive.call(this, el, tpl, expr, attr));
	
	    _this.observeHandler = _this.observeHandler.bind(_this);
	    _this.lengthObserveHandler = _this.lengthObserveHandler.bind(_this);
	
	    var token = expr.match(eachReg);
	    if (!token) throw Error('Invalid Expression[' + expr + '] on Each Directive');
	
	    _this.scopeExpr = token[2];
	    _this.indexExpr = token[4];
	
	    var aliasToken = token[1].match(eachAliasReg);
	    if (!aliasToken) throw Error('Invalid Expression[' + token[1] + '] on Each Directive');
	
	    _this.valueAlias = aliasToken[2] || aliasToken[5];
	    _this.keyAlias = aliasToken[4] || aliasToken[7];
	
	    _this.begin = document.createComment('each begin');
	    dom.before(_this.begin, _this.el);
	    _this.end = document.createComment('each end');
	    dom.after(_this.end, _this.begin);
	
	    dom.remove(_this.el);
	    var div = document.createElement('div');
	    dom.append(div, _this.el);
	    _this.el = div;
	    return _this;
	  }
	
	  EachDirective.prototype.update = function update(data) {
	    var _this2 = this;
	
	    var parentScope = this.realScope(),
	        begin = this.begin,
	        end = this.end,
	        indexExpr = this.indexExpr,
	        valueAlias = this.valueAlias,
	        keyAlias = this.keyAlias,
	        init = !this.cache,
	        oldSort = this.sort,
	        sort = this.sort = new Array(data.length),
	        cache = init ? this.cache = {} : this.cache,
	        removed = [],
	        added = [];
	
	    _.each(data, function (item, idx) {
	      var index = indexExpr ? _.get(item, indexExpr) : idx,
	          // read index of data item
	      scope = !init && cache[index]; // find scope in cache
	
	      if (scope) {
	        // update scope
	        _this2.initScope(scope, item, idx, index);
	      } else {
	        // create scope
	        scope = cache[index] = _this2.createScope(parentScope, item, idx, index);
	        if (!init) added.push(scope);
	      }
	      sort[idx] = scope; // update sort
	      if (init) {
	        // init compontent
	        scope.$tpl = new TemplateInstance(dom.cloneNode(_this2.el), scope, _this2.tpl.delimiterReg, _this2.tpl.directiveReg);
	        data[idx] = scope[valueAlias];
	        scope.$tpl.before(end);
	      }
	    });
	    if (!init) {
	      _.each(oldSort, function (oldScope) {
	        var scope = cache[oldScope.$index];
	        if (scope && scope !== sort[oldScope.$sort]) {
	          removed.push(oldScope);
	          cache[oldScope.$index] = undefined;
	        }
	      });
	
	      _.each(added, function (scope) {
	        var scope2 = removed.pop();
	        if (scope2) {
	          _this2.initScope(scope2, scope);
	          cache[scope.$index] = scope2;
	          sort[scope.$sort] = scope2;
	          scope = scope2;
	        } else {
	          scope.$tpl = new TemplateInstance(dom.cloneNode(_this2.el), scope, _this2.tpl.delimiterReg, _this2.tpl.directiveReg);
	        }
	        data[scope.$sort] = scope[valueAlias];
	        scope.$tpl.after(scope.$sort ? sort[scope.$sort - 1].$tpl.els : begin);
	      });
	
	      _.each(removed, function (scope) {
	        scope.$tpl.destroy();
	      });
	    }
	  };
	
	  EachDirective.prototype.createScope = function createScope(parentScope, value, i, index) {
	    var scope = _.create(parentScope);
	    scope.$parent = parentScope;
	    scope.$eachContext = this;
	    scope.$tpl = null;
	    this.initScope(scope, value, i, index, true);
	    return scope;
	  };
	
	  EachDirective.prototype.initScope = function initScope(scope, value, i, index, isCreate) {
	    if (!isCreate) scope = scope.$tpl.scope;
	    scope.$sort = i;
	    scope[this.valueAlias] = value;
	    if (this.keyAlias) scope[this.keyAlias] = i;
	    scope.$index = index;
	  };
	
	  EachDirective.prototype.bind = function bind() {
	    _Directive.prototype.bind.call(this);
	    this.observe(this.scopeExpr, this.observeHandler);
	    this.observe(this.scopeExpr + '.length', this.lengthObserveHandler);
	    this.update(this.target());
	  };
	
	  EachDirective.prototype.unbind = function unbind() {
	    _Directive.prototype.unbind.call(this);
	    this.unobserve(this.scopeExpr, this.observeHandler);
	    this.unobserve(this.scopeExpr + '.length', this.lengthObserveHandler);
	  };
	
	  EachDirective.prototype.target = function target() {
	    return this.get(this.scopeExpr);
	  };
	
	  EachDirective.prototype.observeHandler = function observeHandler(expr, target) {
	    this.update(target);
	  };
	
	  EachDirective.prototype.lengthObserveHandler = function lengthObserveHandler() {
	    this.update(this.target());
	  };
	
	  return EachDirective;
	}(Directive);
	
	EachDirective.prototype.abstract = true;
	EachDirective.prototype.block = true;
	EachDirective.prototype.priority = 10;
	
	Directive.register('each', EachDirective);

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _ = __webpack_require__(2);
	var dom = __webpack_require__(4);
	
	var _require = __webpack_require__(12);
	
	var Directive = _require.Directive;
	var expression = __webpack_require__(19);
	var expressionArgs = ['$el', '$event'];
	
	function registerDirective(name, opt) {
	  var cls = Directive.register(name, opt);
	  module.exports[cls.className] = cls;
	}
	
	var EventDirective = exports.EventDirective = function (_Directive) {
	  _inherits(EventDirective, _Directive);
	
	  function EventDirective(el, tpl, expr, attr) {
	    _classCallCheck(this, EventDirective);
	
	    var _this = _possibleConstructorReturn(this, _Directive.call(this, el, tpl, expr, attr));
	
	    _this.handler = _this.handler.bind(_this);
	    _this.expression = expression.parse(_this.expr, expressionArgs);
	    return _this;
	  }
	
	  EventDirective.prototype.handler = function handler(e) {
	    var scope = this.scope(),
	        exp = this.expression,
	        fn = void 0;
	
	    e.stopPropagation();
	    if (this.expression.applyFilter(e, this, [scope, this.el, e]) === false) return;
	    fn = exp.execute.call(this, scope, this.el, e);
	    if (exp.simplePath) {
	      if (typeof fn != 'function') throw TypeError('Invalid Event Handler:' + this.expr + ' -> ' + fn);
	      var _scope = this.propScope(exp.path[0]);
	      fn.call(_scope, scope, this.el, e, _scope);
	    }
	  };
	
	  EventDirective.prototype.bind = function bind() {
	    _Directive.prototype.bind.call(this);
	    dom.on(this.el, this.eventType, this.handler);
	  };
	
	  EventDirective.prototype.unbind = function unbind() {
	    _Directive.prototype.unbind.call(this);
	    dom.off(this.el, this.eventType, this.handler);
	  };
	
	  return EventDirective;
	}(Directive);
	
	var events = ['blur', 'change', 'click', 'dblclick', 'error', 'focus', 'keydown', 'keypress', 'keyup', 'load', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'resize', 'scroll', 'select', 'submit', 'unload', {
	  name: 'oninput',
	  eventType: 'input propertychange'
	}];
	
	_.each(events, function (opt) {
	  opt = _.isObject(opt) ? opt : {
	    eventType: opt
	  };
	  opt.name = opt.name || 'on' + opt.eventType;
	  opt.extend = EventDirective;
	  registerDirective(opt.name, opt);
	});

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _ = __webpack_require__(2);
	var dom = __webpack_require__(4);
	
	var _require = __webpack_require__(12);
	
	var Directive = _require.Directive;
	var expression = __webpack_require__(19);
	var YieId = _.YieId;
	var expressionArgs = ['$el'];
	
	function registerDirective(name, opt) {
	  var cls = Directive.register(name, opt);
	  module.exports[cls.className] = cls;
	}
	
	var SimpleDirective = exports.SimpleDirective = function (_Directive) {
	  _inherits(SimpleDirective, _Directive);
	
	  function SimpleDirective(el, tpl, expr, attr) {
	    _classCallCheck(this, SimpleDirective);
	
	    var _this = _possibleConstructorReturn(this, _Directive.call(this, el, tpl, expr, attr));
	
	    _this.observeHandler = _this.observeHandler.bind(_this);
	    _this.expression = expression.parse(_this.expr, expressionArgs);
	    return _this;
	  }
	
	  SimpleDirective.prototype.realValue = function realValue() {
	    return this.expression.execute.call(this, this.scope(), this.el);
	  };
	
	  SimpleDirective.prototype.value = function value() {
	    return this.expression.executeAll.call(this, this.scope(), this.el);
	  };
	
	  SimpleDirective.prototype.bind = function bind() {
	    var _this2 = this;
	
	    _Directive.prototype.bind.call(this);
	    _.each(this.expression.identities, function (ident) {
	      _this2.observe(ident, _this2.observeHandler);
	    });
	    this.update(this.value());
	  };
	
	  SimpleDirective.prototype.unbind = function unbind() {
	    var _this3 = this;
	
	    _Directive.prototype.unbind.call(this);
	    _.each(this.expression.identities, function (ident) {
	      _this3.unobserve(ident, _this3.observeHandler);
	    });
	  };
	
	  SimpleDirective.prototype.blankValue = function blankValue(val) {
	    if (arguments.length == 0) val = this.value();
	    return _.isNil(val) ? '' : val;
	  };
	
	  SimpleDirective.prototype.observeHandler = function observeHandler(expr, val) {
	    if (this.expression.simplePath) {
	      this.update(this.expression.applyFilter(val, this, [this.scope(), this.el]));
	    } else {
	      this.update(this.value());
	    }
	  };
	
	  SimpleDirective.prototype.update = function update(val) {
	    throw 'Abstract Method [' + this.className + '.update]';
	  };
	
	  return SimpleDirective;
	}(Directive);
	
	var EVENT_CHANGE = 'change',
	    EVENT_INPUT = 'input',
	    EVENT_CLICK = 'click',
	    TAG_SELECT = 'SELECT',
	    TAG_INPUT = 'INPUT',
	    TAG_TEXTAREA = 'TEXTAREA',
	    RADIO = 'radio',
	    CHECKBOX = 'checkbox',
	    directives = {
	  text: {
	    update: function update(val) {
	      dom.text(this.el, this.blankValue(val));
	    },
	
	    block: true
	  },
	  html: {
	    update: function update(val) {
	      dom.html(this.el, this.blankValue(val));
	    },
	
	    block: true
	  },
	  'class': {
	    update: function update(value) {
	      if (value && typeof value == 'string') {
	        this.handleArray(_.trim(value).split(/\s+/));
	      } else if (value instanceof Array) {
	        this.handleArray(value);
	      } else if (value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object') {
	        this.handleObject(value);
	      } else {
	        this.cleanup();
	      }
	    },
	    handleObject: function handleObject(value) {
	      this.cleanup(value, false);
	      var keys = this.prevKeys = [],
	          el = this.el;
	      for (var key in value) {
	        if (value[key]) {
	          dom.addClass(el, key);
	          keys.push(key);
	        } else {
	          dom.removeClass(el, key);
	        }
	      }
	    },
	    handleArray: function handleArray(value) {
	      this.cleanup(value, true);
	      var keys = this.prevKeys = [],
	          el = this.el;
	      _.each(value, function (val) {
	        if (val) {
	          keys.push(val);
	          dom.addClass(el, val);
	        }
	      });
	    },
	    cleanup: function cleanup(value, isArr) {
	      var prevKeys = this.prevKeys;
	      if (prevKeys) {
	        var i = prevKeys.length,
	            el = this.el;
	        while (i--) {
	          var key = prevKeys[i];
	          if (!value || (isArr ? _.indexOf(value, key) == -1 : !_.hasOwnProp(value, key))) {
	            dom.removeClass(el, key);
	          }
	        }
	      }
	    }
	  },
	  'style': {
	    update: function update(value) {
	      if (value && _.isString(value)) {
	        dom.style(this.el, value);
	      } else if (value && _.isObject(value)) {
	        this.handleObject(value);
	      }
	    },
	    handleObject: function handleObject(value) {
	      this.cleanup(value);
	      var keys = this.prevKeys = [],
	          el = this.el;
	      _.each(value, function (val, key) {
	        dom.css(el, key, val);
	      });
	    }
	  },
	  show: {
	    update: function update(val) {
	      dom.css(this.el, 'display', val ? '' : 'none');
	    }
	  },
	  hide: {
	    update: function update(val) {
	      dom.css(this.el, 'display', val ? 'none' : '');
	    }
	  },
	  value: {
	    update: function update(val) {
	      dom.val(this.el, this.blankValue(val));
	    }
	  },
	  'if': {
	    bind: function bind() {
	      SimpleDirective.prototype.bind.call(this);
	      if (!this.directives) return this.yieId = new YieId();
	    },
	    update: function update(val) {
	      if (!val) {
	        dom.css(this.el, 'display', 'none');
	      } else {
	        if (!this.directives) {
	          var _directives = this.directives = this.tpl.parseChildNodes(this.el);
	          _.each(_directives, function (dir) {
	            dir.bind();
	          });
	          if (this.yieId) {
	            this.yieId.done();
	            this.yieId = undefined;
	          }
	        }
	        dom.css(this.el, 'display', '');
	      }
	    },
	    unbind: function unbind() {
	      SimpleDirective.prototype.unbind.call(this);
	      if (this.directives) {
	        var _directives2 = this.directives;
	        _.each(_directives2, function (dir) {
	          dir.unbind();
	        });
	      }
	    },
	
	    priority: 9,
	    block: true
	  },
	  checked: {
	    update: function update(val) {
	      _.isArray(val) ? dom.checked(this.el, _.indexOf(val, dom.val(this.el))) : dom.checked(this.el, !!val);
	    }
	  },
	  selected: {
	    update: function update(val) {}
	  },
	  focus: {
	    update: function update(val) {
	      if (val) dom.focus(this.el);
	    }
	  },
	  input: {
	    constructor: function constructor(el) {
	      SimpleDirective.apply(this, arguments);
	
	      if (!this.expression.simplePath) throw TypeError('Invalid Expression[' + this.expression.expr + '] on InputDirective');
	
	      this.onChange = this.onChange.bind(this);
	      var tag = this.tag = el.tagName;
	      switch (tag) {
	        case TAG_SELECT:
	          this.event = EVENT_CHANGE;
	          break;
	        case TAG_INPUT:
	          var type = this.type = el.type;
	          this.event = type == RADIO || type == CHECKBOX ? EVENT_CHANGE : EVENT_INPUT;
	          break;
	        case TAG_TEXTAREA:
	          throw TypeError('Directive[input] not support ' + tag);
	          break;
	        default:
	          throw TypeError('Directive[input] not support ' + tag);
	      }
	    },
	    bind: function bind() {
	      SimpleDirective.prototype.bind.call(this);
	      dom.on(this.el, this.event, this.onChange);
	    },
	    unbind: function unbind() {
	      SimpleDirective.prototype.unbind.call(this);
	      dom.off(this.el, this.event, this.onChange);
	    },
	    setRealValue: function setRealValue(val) {
	      this.set(this.expression.path, val);
	    },
	    setValue: function setValue(val) {
	      this.setRealValue(this.expression.applyFilter(val, this, [this.scope(), this.el], false));
	    },
	    onChange: function onChange(e) {
	      var val = this.elVal(),
	          idx = void 0,
	          _val = this.val;
	      if (val != _val) this.setValue(val);
	      e.stopPropagation();
	    },
	    update: function update(val) {
	      var _val = this.blankValue(val);
	      if (_val != this.val) this.elVal(this.val = _val);
	    },
	    elVal: function elVal(val) {
	      var tag = this.tag;
	
	      switch (tag) {
	        case TAG_SELECT:
	          break;
	        case TAG_INPUT:
	          var type = this.type;
	
	          if (type == RADIO || type == CHECKBOX) {
	            if (arguments.length == 0) {
	              return dom.checked(this.el) ? dom.val(this.el) : undefined;
	            } else {
	              var checked = void 0;
	
	              checked = val == dom.val(this.el);
	              if (dom.checked(this.el) != checked) dom.checked(this.el, checked);
	            }
	          } else {
	            if (arguments.length == 0) {
	              return dom.val(this.el);
	            } else if (val != dom.val(this.el)) {
	              dom.val(this.el, val);
	            }
	          }
	          break;
	        case TAG_TEXTAREA:
	          throw TypeError('Directive[input] not support ' + tag);
	          break;
	        default:
	          throw TypeError('Directive[input] not support ' + tag);
	      }
	    },
	
	    priority: 4
	  }
	};
	
	_.each(directives, function (opt, name) {
	  opt.extend = SimpleDirective;
	  registerDirective(name, opt);
	});

/***/ }
/******/ ])
});
;
//# sourceMappingURL=tpl.js.map