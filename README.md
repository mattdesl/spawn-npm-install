# spawn-npm-install

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

Programmatically install/uninstall npm dependencies by spawning a `npm` child process.

```js
var install = require('spawn-npm-install')

install(['through2', 'quote-stream'], { saveDev: true }, function(err) {
  if (err)
    console.error("Could not install:\n" + err.message)
  else
    console.log("Installed.")
})
```

Returns the child process, so you can print install log/warnings like so:

```js
var proc = install('tape')
proc.stderr.pipe(process.stderr)
proc.stdout.pipe(process.stdout)
```

Or, to preserve log output and colors:

```js
install('tape', { stdio: 'inherit' })
```

PRs welcome.

## Usage

[![NPM](https://nodei.co/npm/spawn-npm-install.png)](https://www.npmjs.com/package/spawn-npm-install)

#### `spawn = require('spawn-npm-install')`
#### `proc = spawn.install(dependencies, [opt], [cb])`

Spawns an `npm install` using the given `dependencies` (string or array of strings). You can pass `opt` to the command, which will convert [camel case to dash-case](https://www.npmjs.com/package/dargs) for the CLI arguments. The last parameter `cb` is the callback which is passed `(err)` on failure, or null otherwise.

You can specify a `command` for options to use instead of the default `npm` (e.g. for specialized [analytics](https://github.com/mattdesl/npm-install-analytics) or other hooks).

Also accepts some options for the [child process](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options):

- `env` environment variables
- `stdio` the standard err/out
- `cwd` the current working directory

Returns the child process.

Examples:

```js
var install = require('spawn-npm-install')
install('tape', { saveDev: true }, done)

install(['zalgo', 'img'], function(err) {
  if (err) 
    console.error(err.message)
})
```

The default export `spawn` is the same as `spawn.install`, for symmetry.

#### `proc = spawn.uninstall(dependencies, [opt], [cb])`

The same as above, but triggers `npm uninstall` instead. 

## License

MIT, see [LICENSE.md](http://github.com/mattdesl/spawn-npm-install/blob/master/LICENSE.md) for details.
