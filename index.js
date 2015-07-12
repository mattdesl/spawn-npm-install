var spawn = require('child_process').spawn
var dargs = require('dargs')
var noop = function () {}

module.exports = command.bind(null, 'install')
module.exports.install = command.bind(null, 'install')
module.exports.uninstall = command.bind(null, 'uninstall')

function command (cmd, packages, opt, cb) {
  if (typeof opt === 'function') {
    cb = opt
    opt = {}
  } else {
    opt = opt || {}
  }
  cb = cb || noop
  if (typeof packages === 'function') {
    throw new TypeError('expected packages as first argument')
  }

  // packages to install
  var deps = [].concat(packages).filter(Boolean)
  if (deps.length === 0) {
    return process.nextTick(function () {
      cb(null)
    })
  }

  var npmCmd = opt.command
  if (!npmCmd) {
    npmCmd = process.platform === 'win32'
      ? 'npm.cmd'
      : 'npm'
  }

  var spawnArgs = {
    cwd: opt.cwd,
    env: opt.env || process.env,
    stdio: opt.stdio
  }
  var cliArgs = dargs(opt, {
    excludes: Object.keys(spawnArgs)
  })
  var args = [cmd].concat(deps).concat(cliArgs)
  var proc = spawn(npmCmd, args, spawnArgs)
  var error = ''

  if (proc.stderr) {
    proc.stderr.on('data', function (data) {
      error += data.toString()
    })
  }

  proc.once('exit', function (code) {
    // ensure we pass an Error
    if (code === 0) {
      cb(null)
    } else {
      var msg = error || 'exit code ' + code
      cb(new Error(msg))
    }
  })

  return proc
}
