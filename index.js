var npm = require('npm')
var noop = function () {}

module.exports = command.bind(null, 'install')
module.exports.uninstall = command.bind(null, 'uninstall')

function command (cmd, dependencies, opt, cb) {
  if (typeof opt === 'function') {
    cb = opt
    opt = {}
  } else
    opt = opt || {}
  cb = cb || noop

  dependencies = [].concat(dependencies).filter(Boolean)

  // no deps... skip install
  if (dependencies.length === 0) {
    process.nextTick(function () {
      cb(null, { tree: [], packages: [] })
    })
  } else {
    npm.load(opt, function (err) {
      if (err)
        return cb(new Error('could not load npm config'))

      npm.commands[cmd](dependencies, function (err, data) {
        if (err)
          return cb(new Error('could not load dependencies: ' + err.message))
        cb(err, cmd === 'uninstall' ? data : normalize(data))
      })
    })

  }

  function normalize (data) {
    var names = dependencies.map(name)

    // for convenience, extract the top-level modules
    var installed = data.filter(function (result) {
      return !result[2] && !result[3]
    }).map(function (result) {
      return result[0]
    }).sort(function (a, b) {
      // also sort to better match input
      return names.indexOf(name(a)) - names.indexOf(name(b))
    })

    return {
      packages: installed,
      tree: data
    }
  }
}

function name (package) {
  return package.split('@')[0]
}
