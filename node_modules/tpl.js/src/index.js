let tpl = require('./template'),
  observer = require('observer'),
  _ = require('./util'),
  cfg = require('./config')

_.assign(tpl, _, require('./dom'), {
  filter: require('./filter'),
  expression: require('./expression'),
  Directive: require('./binding').Directive,
  directives: require('./directives'),
  config: cfg,
  init(config) {
    observer.init(config)
    if (config)
      _.each(cfg, (val, key) => {
        if (_.hasOwnProp(config, key))
          cfg[key] = config[key]
      })
  }
})
module.exports = tpl;
