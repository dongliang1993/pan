import { resolve, winPath } from '@pan/utils'
import { existsSync } from 'fs'
import assert from 'assert'

type PluginType = 'plugin' | 'preset'

interface PluginOpts {
  path: string
  cwd: string
  type: PluginType
}

// 用来注册 plugin
export class Plugin {
  private cwd: string
  type: PluginType
  path: string
  apply?: Function
  id: string

  constructor(opts: PluginOpts) {
    this.type = opts.type
    this.path = winPath(opts.path)
    this.cwd = opts.cwd

    assert(existsSync(this.path), `Invalid ${this.path}, it's not exists.`)

    // path is the package entry
    let isPkgEntry = false
    this.id = this.getId({ isPkgEntry })

    this.apply = () => {
      let ret
      try {
        ret = require(this.path)
      } catch (e: any) {
        throw new Error(`Register ${this.path} failed, since ${e.message}`)
      } finally {
      }
      // use the default member for es modules
      return ret.__esModule ? ret.default : ret
    }
  }

  getId(opts: { isPkgEntry: boolean }) {
    let id = winPath(this.path)
    // if (opts.isPkgEntry) {
    //   id = opts.pkg!.name
    // } else if (winPath(this.path).startsWith(winPath(this.cwd))) {
    //   id = `./${winPath(relative(this.cwd, this.path))}`
    // } else if (opts.pkgJSONPath) {
    //   id = winPath(
    //     join(opts.pkg!.name, relative(dirname(opts.pkgJSONPath), this.path))
    //   )
    // } else {
    //   id = winPath(this.path)
    // }
    id = id.replace('@pan/preset-pan/lib/plugins', '@@')
    id = id.replace(/\.js$/, '')
    return id
  }

  /**
   * 寻找 plugins 和 presets
   * @param opts
   * @returns
   */
  static getPluginsAndPresets(opts: {
    cwd: string
    pkg: any
    plugins?: string[]
    presets?: string[]
  }) {
    function get(type: 'plugin' | 'preset') {
      const types = `${type}s` as 'plugins' | 'presets'
      return [...(opts[types] || [])].map((path) => {
        assert(
          typeof path === 'string',
          `Invalid plugin ${path}, it must be string.`
        )
        let resolved
        try {
          resolved = resolve.sync(path, {
            basedir: opts.cwd,
            extensions: ['.tsx', '.ts', '.mjs', '.jsx', '.js'],
          })
        } catch (_e) {
          throw new Error(`Invalid plugin ${path}, can not be resolved.`)
        }

        return new Plugin({
          type,
          path: resolved,
          cwd: opts.cwd,
        })
      })
    }

    return {
      presets: get('preset'),
      plugins: get('plugin'),
    }
  }
}
