import { chalk, logger } from '@pan/utils'
import assert from 'assert'
import { Service } from './service'
import { Plugin } from './plugin'
import { Command, CommandOpts } from './command'
import { Generator } from './generator'
import { makeArray } from './utils'

type Logger = typeof logger

/**
 * 供 plugin 使用的核心 api
 */
export class PluginAPI {
  service: Service
  plugin: Plugin

  constructor(opts: { service: Service; plugin: Plugin }) {
    this.service = opts.service
    this.plugin = opts.plugin

    // logger
    const loggerKeys: (keyof Logger)[] = [
      'wait',
      'error',
      'warn',
      'ready',
      'info',
      'event',
      'debug',
    ]

    // @ts-ignore
    this.logger = loggerKeys.reduce<Logger>((memo, key) => {
      // @ts-ignore
      memo[key] = (...message: string[]) => {
        const func = logger[key]
        if (typeof func !== 'function') {
          return
        }

        func(chalk.green(`[plugin:]`), ...message)
      }
      return memo
    }, {} as any)
  }

  registerGenerator(opts: Generator) {
    const { key } = opts
    assert(
      !this.service.generators[key],
      `api.registerGenerator() failed, the generator ${key} is exists.`
    )
    this.service.generators[key] = {
      ...opts,
    } as Generator
  }

  /**
   * 注册命令行指令，比如 generate
   * @param opts
   * eg:   
   * api.registerCommand({
      name: 'generate',
      alias: 'g',
      fn: async ({ args }) => {
        await delay(100);
        return `hello ${api.args.projectName}`;
      },
   * });
   * alias 为别名，比如 generate 的别名 g   
   */
  registerCommand(opts: CommandOpts & { alias?: string | string[] }) {
    const { alias, name } = opts
    delete opts.alias

    this.service.commands[name] = new Command({
      ...opts,
    })

    if (alias) {
      const aliases = makeArray(alias)
      aliases.forEach((alias) => {
        this.service.commands[alias] = new Command({
          ...opts,
          name: alias,
        })
      })
    }
  }

  static addProxyAPI(opts: {
    pluginAPI: PluginAPI
    service: Service
    serviceProps: string[]
  }) {
    return new Proxy(opts.pluginAPI, {
      get: (target, prop: string) => {
        if (opts.serviceProps.includes(prop)) {
          // @ts-ignore
          const serviceProp = opts.service[prop]
          return typeof serviceProp === 'function'
            ? serviceProp.bind(opts.service)
            : serviceProp
        }
        // @ts-ignore
        return target[prop]
      },
    })
  }
}
