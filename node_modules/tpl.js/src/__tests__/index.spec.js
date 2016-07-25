const tpl = require('../index');

Object.keys = Object.keys || function(obj) {
    let arr = [];
    for (let key in obj) {
      arr.push(key)
    }
    return arr;
}
Array.prototype.forEach = Array.prototype.forEach || function(cb) {
    for (let i = 0, l = this.length; i < l; i++) {
      cb(this[i], i);
    }
}

var testsContext = require.context('.', true, /\.spec$/)
testsContext.keys().forEach(testsContext)
