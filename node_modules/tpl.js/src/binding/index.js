const _ = require('../util')

_.each(['abstractBinding', 'binding', 'text', 'directive', 'directiveGroup', 'text'], (name) => {
  module.exports[_.upperFirst(name)] = require('./' + name)
})
