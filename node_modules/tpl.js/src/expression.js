const _ = require('./util'),
  filter = require('./filter'),
  defaultKeywords = _.reverseConvert('Math,Date,this,true,false,null,undefined,Infinity,NaN,isNaN,isFinite,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,parseInt,parseFloat,$scope'.split(','), () => true),
  wsReg = /\s/g,
  newlineReg = /\n/g,
  translationReg = /[\{,]\s*[\w\$_]+\s*:|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`)|new |typeof |void |(\|\|)/g,
  translationRestoreReg = /"(\d+)"/g,
  pathTestReg = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*$/,
  booleanLiteralReg = /^(?:true|false)$/,
  identityReg = /[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*[^\w$\.]/g,
  propReg = /^[A-Za-z_$][\w$]*/

let translations = []

function translationProcessor(str, isString) {
  let i = translations.length
  translations[i] = isString ? str.replace(newlineReg, '\\n') : str
  return `"${i}"`
}

function translationRestoreProcessor(str, i) {
  return translations[i]
}

let currentIdentities, currentKeywords, prevPropScope

function identityProcessor(raw, idx, str) {
  let l = raw.length,
    suffix = raw.charAt(l - 1),
    exp = raw.slice(0, l - 1),
    prop = exp.match(propReg)[0]

  if (defaultKeywords[prop] || currentKeywords[prop])
    return raw
  if (prop === '$context')
    return raw.replace(propReg, prevPropScope)
  if (suffix == '(') {
    suffix = (idx + l == str.length || str.charAt(idx + l) == ')') ? '' : ','
    prevPropScope = `this.propScope('${prop}')`
    return `$scope.${exp}.call(${prevPropScope}${suffix}`
  }
  currentIdentities[exp] = true
  return `$scope.${exp}${suffix}`
}

function complileExpr(body) {
  prevPropScope = undefined;
  return (body + ' ').replace(identityReg, identityProcessor)
    .replace(translationRestoreReg, translationRestoreProcessor);
}

function compileFilterArgs(argExprs, keywords) {
  for (let i = 0, l = argExprs.length; i < l; i++) {
    argExprs[i] = makeExecuter(complileExpr(argExprs[i]), keywords);
  }
  return argExprs;
}

function compileFilter(filterExprs, keywords) {
  if (!filterExprs || !filterExprs.length)
    return [];

  let filters = [],
    filterExpr, name, argExprs

  for (let i = 0, l = filterExprs.length; i < l; i++) {
    if ((filterExpr = _.trim(filterExprs[i]))) {
      argExprs = filterExpr.replace(/,?\s+/g, ',').split(',')
      filters.push({
        name: argExprs.shift().replace(translationRestoreReg, translationRestoreProcessor),
        args: compileFilterArgs(argExprs, keywords)
      })
    }
  }
  return filters
}

function compileExecuter(exp, keywords) {
  let filterExprs, ret,
    isSimple = isSimplePath(exp)

  currentIdentities = {}
  currentKeywords = keywords ? _.reverseConvert(keywords, () => true) : {}

  if (!isSimple) {
    filterExprs = exp.replace(translationReg, translationProcessor).split('|')
    exp = filterExprs.shift().replace(wsReg, '')
    isSimple = isSimplePath(exp)
  }
  if (isSimple) {
    exp = exp.replace(translationRestoreReg, translationRestoreProcessor)
    currentIdentities[exp] = true
    ret = {
      execute: makeExecuter(`$scope.${exp}`, keywords),
      path: _.parseExpr(exp),
      expr: exp
    }
  } else {
    ret = {
      execute: makeExecuter(complileExpr(exp), keywords),
      expr: exp
    }
  }
  ret.filters = compileFilter(filterExprs, keywords)
  ret.simplePath = isSimple;
  ret.identities = _.keys(currentIdentities)

  currentKeywords = undefined
  currentIdentities = undefined
  translations.length = 0
  ret.applyFilter = function(data, argScope, args, apply) {
    let fs = ret.filters,
      f, _args, rs

    for (let i = 0, l = fs.length; i < l; i++) {
      f = fs[i]
      _args = parseFilterArgs(f.args, argScope, args)
      rs = (apply !== false ? filter.apply : filter.unapply)(f.name, data, _args)
      if (rs.stop) {
        return rs.data
      } else if (rs.replaceData)
        data = rs.data
    }
    return data
  }
  ret.executeAll = function() {
    let val = ret.execute.apply(this, arguments)
    val = ret.applyFilter(val, this, arguments)
    return val
  }
  return ret
}

function parseFilterArgs(executors, scope, args) {
  return _.map(executors, (executor)=>{
    return executor.apply(scope, args)
  })
}

function makeExecuter(body, args) {
  let _args = ['$scope']

  args = args ? _args.concat(args) : _args
  args.push(`return ${body};`)
  try {
    return Function.apply(Function, args)
  } catch (e) {
    throw Error(`Invalid expression. Generated function body: ${body}`)
  }
}

function isSimplePath(exp) {
  return pathTestReg.test(exp) &&
    !booleanLiteralReg.test(exp)
}

let cache = {}

export function parse(exp, args) {
  exp = _.trim(exp)
  let res
  if ((res = cache[exp]))
    return res
  cache[exp] = res = compileExecuter(exp, args)
  return res
}
