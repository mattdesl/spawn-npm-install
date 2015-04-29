var install = require('./')
var uninstall = require('./').uninstall
var test = require('tape')
var json = require('read-json')
var path = require('path')

test('no deps should install', function(t) {
  var zalgo = true
  install([], function(err, data) {
    t.deepEqual(data.packages, [], 'no packages')
    t.deepEqual(data.tree, [], 'no tree')
    t.equal(zalgo, false, 'method is async')
  })
  zalgo = false
  t.plan(3)
})

test('should install deps', function(t) {
  t.plan(2)
  var list = ['through', 'tape', 'quote-stream']
  install(list, {}, function(err, data) {
    if (err) return t.fail(err)

    var names = data.packages.map(toName)
    t.deepEqual(names, list)
    t.ok(data.tree.length !== 0, 'has some entries')
  })
})

test('should install --save-dev deps', function(t) {
  t.plan(2)
  var list = ['zalgo']
  install(list, { saveDev: true }, function(err, data) {
    var names = data.packages.map(toName)
    t.deepEqual(names, ['zalgo'], 'installed --save-dev zalgo')
    includes(t, 'zalgo', true)
  })
})

// test('should uninstall --save-dev', function(t) {
//   t.plan(2)
//   var list = ['zalgo']
//   uninstall(list, {}, function(err, data) {
//     if (err) return t.fail(err)
//     t.deepEqual(data, ['zalgo'], 'uninstalls zalgo')
//     includes(t, 'zalgo', false)
//   })
// })

function toName(pkg) {
  return pkg.split('@')[0]
}

function includes(t, name, expected) {
  json(path.join(__dirname, 'package.json'), function(err, data) {
    if (err) t.fail(err)

    var idx = Object.keys(data.devDependencies).indexOf(name)
    if (expected)
      t.notEqual(idx, -1, 'has dep')
    else
      t.equal(idx, -1, 'does not have dep')
  })
}