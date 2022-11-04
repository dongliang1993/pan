import assert from 'assert'
import { existsSync } from 'fs'
import { join } from 'path'

import { PluginAPI } from './pluginAPI'
import { Plugin } from './plugin'
import { Generator } from './generator'
import { Command } from './command'

import { Env, PluginType } from '../types'

interface ServiceOpts {
  /**
   * cli 命令执行的文件夹地址
   */
  cwd: string
  env: Env
  presets?: string[]
  plugins?: string[]
}

export class Service {
  private opts: ServiceOpts
  cwd: string
  env: Env
  commands: Record<string, Command> = {}
  generators: Record<string, Generator> = {}

  pkg: {
    name?: string
    version?: string
    dependencies?: Record<string, string>
    devDependencies?: Record<string, string>
    [key: string]: any
  } = {}
  pkgPath: string = ''

  constructor(opts: ServiceOpts) {
    this.cwd = opts.cwd
    this.env = opts.env
    this.opts = opts
    this.commands = {}
    this.generators = {}

    assert(existsSync(this.cwd), `Invalid cwd ${this.cwd}, it's not found.`)
  }

  async initPlugin(opts: { plugin: Plugin }) {
    // apply with PluginAPI
    const pluginAPI = new PluginAPI({
      service: this,
      plugin: opts.plugin,
    })

    let ret = await opts.plugin.apply?.()(pluginAPI)

    // preset 也是一种 plugin ，只不过它内部返回了形如 {presets: [], plugins: []}
    // 这样的数据结构
    if (ret?.presets) {
      ret.presets = ret.presets.map(
        (preset: string) =>
          new Plugin({
            path: preset,
            type: PluginType.preset,
            cwd: this.cwd,
          })
      )
    }
    if (ret?.plugins) {
      ret.plugins = ret.plugins.map(
        (plugin: string) =>
          new Plugin({
            path: plugin,
            type: PluginType.plugin,
            cwd: this.cwd,
          })
      )
    }
    return ret || {}
  }

  async initPreset(opts: {
    preset: Plugin
    presets: Plugin[]
    plugins: Plugin[]
  }) {
    const { presets, plugins } = await this.initPlugin({
      plugin: opts.preset,
    })
    opts.presets.unshift(...(presets || []))
    opts.plugins.push(...(plugins || []))
  }

  // 获取 package.json 相关信息
  initPkgInfo() {
    let pkg: Record<string, string | Record<string, any>> = {}
    let pkgPath: string = ''
    try {
      pkgPath = join(this.cwd, 'package.json')
      pkg = require(pkgPath)
    } catch (_e) {}
    this.pkg = pkg
    this.pkgPath = pkgPath || join(this.cwd, 'package.json')
  }

  async run(opts: { name: string; args?: any }) {
    const { name, args = {} } = opts
    args._ = args._ || []
    // args._[0] 一般就是 name
    // 所以这里先处理一下命令行的参数
    if (args._[0] === name) {
      args._.shift()
    }

    // 获取 package.json 相关信息
    this.initPkgInfo()

    // 加载内部和传入的 presets and plugins
    const { plugins, presets } = Plugin.getPluginsAndPresets({
      cwd: this.cwd,
      pkg: this.pkg,
      plugins: [require.resolve('./generatePlugin')].concat(
        this.opts.plugins || []
      ),
      presets: this.opts.presets,
    })

    // 注册的 presets
    const presetPlugins: Plugin[] = []
    while (presets.length) {
      await this.initPreset({
        preset: presets.shift()!,
        presets,
        plugins: presetPlugins,
      })
    }

    plugins.unshift(...presetPlugins)
    // 注册内置的 plugins
    while (plugins.length) {
      await this.initPlugin({ plugin: plugins.shift()! })
    }

    const command = this.commands[name]
    assert(command, `Invalid command ${name}, it's not registered.`)

    // run command
    const ret = await command.fn({ args })
    return ret
  }
}
