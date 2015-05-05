var install = require('./')
var uninstall = require('./').uninstall
var test = require('tape')
var json = require('read-json')
var path = require('path')
var concat = require('concat-stream')

test('no deps should install', function (t) {
  var zalgo = true
  install([], function (err) {
    if (err) t.fail(err)
    t.equal(zalgo, false, 'method is async')
  })
  zalgo = false
  t.plan(1)
})

test('exports install methods', function (t) {
  install.install([], function (err) {
    if (err) t.fail(err)
    t.ok(true, 'yup, method is there')
  })
  t.plan(1)
})

test('should fail on error', function (t) {
  t.plan(2)
  var list = ['throuaaa(*@gh']
  install(list, {}, function (err) {
    t.equal(typeof err.message, 'string', 'err.message')
    t.notEqual(err, null, 'an error is returned')
  })
})

test('should succeed', function (t) {
  t.plan(1)
  var list = ['through', 'zalgo']
  install(list, {}, function (err) {
    t.equal(err, null, 'no error is returned')
  })
})

test('should print some text', function (t) {
  t.plan(1)
  var proc = install('through', function (err) {
    if (err) t.fail(err)
  })
  proc.stdout.pipe(concat(function (body) {
    t.notEqual(body.toString().indexOf('through'), -1, 'downloaded body')
  }))
})

test('should --save-dev to package.json', function (t) {
  t.plan(1)
  install('quote-stream', {
    saveDev: true
  }, function (err) {
    if (err) t.fail(err)
    includes(t, 'quote-stream', true)
  })
})

test('should uninstall --save-dev', function (t) {
  t.plan(1)
  var list = ['quote-stream']
  uninstall(list, {
    saveDev: true
  }, function (err, data) {
    if (err) return t.fail(err)
    includes(t, 'quote-stream', false)
  })
})

function includes (t, name, expected) {
  json(path.join(__dirname, 'package.json'), function (err, data) {
    if (err) t.fail(err)

    var idx = Object.keys(data.devDependencies).indexOf(name)
    if (expected) {
      t.notEqual(idx, -1, 'has dep')
    } else {
      t.equal(idx, -1, 'does not have dep')
    }
  })
}
