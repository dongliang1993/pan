import assert from 'assert'
import { existsSync } from 'fs'
import { join } from 'path'

import { PluginAPI } from './pluginAPI'
import { Plugin } from './plugin'
import { Generator } from './generator'
import { Command } from './command'

import { Env } from '../types'

interface ServiceOpts {
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
    })

    let ret = await opts.plugin.apply?.()(pluginAPI)

    // if (ret?.presets) {
    //   ret.presets = ret.presets.map(
    //     (preset: string) =>
    //       new Plugin({
    //         path: preset,
    //         cwd: this.cwd,
    //       })
    //   )
    // }
    // if (ret?.plugins) {
    //   ret.plugins = ret.plugins.map(
    //     (plugin: string) =>
    //       new Plugin({
    //         path: plugin,
    //         cwd: this.cwd,
    //       })
    //   )
    // }
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
      pkg = require(join(this.cwd, 'package.json'))
      pkgPath = join(this.cwd, 'package.json')
    } catch (_e) {}
    this.pkg = pkg
    this.pkgPath = pkgPath || join(this.cwd, 'package.json')
  }

  async run(opts: { name: string; args?: any }) {
    const { name, args = {} } = opts
    args._ = args._ || []
    // 先处理一下命令行的参数
    // shift the command itself
    if (args._[0] === name) {
      args._.shift()
    }

    // get pkg from package.json
    this.initPkgInfo()

    // 加载内部和传入的 presets and plugins
    const { plugins } = Plugin.getPluginsAndPresets({
      cwd: this.cwd,
      pkg: this.pkg,
      plugins: [require.resolve('./generatePlugin')].concat(
        this.opts.plugins || []
      ),
      presets: this.opts.presets,
    })

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
