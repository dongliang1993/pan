import assert from "assert";
import { PluginAPI } from "./PluginAPI";
import { Plugin } from "./plugin";

import type { Command } from "./command";
import { Generator as IGenerator } from "../types";

interface ServiceOpts {
  cwd: string;
  presets?: string[];
  plugins?: string[];
}

export class Service {
  private opts: ServiceOpts;
  cwd: string;
  commands: Record<string, Command> = {};
  generators: Record<string, IGenerator> = {};

  constructor(opts: ServiceOpts) {
    // 初始化内部的 plugin 和 presets
    opts.plugins = [
      require.resolve("./generatePlugin"),
      ...(opts?.plugins || []),
    ];
    opts.presets = [require.resolve("../preset"), ...(opts?.presets || [])];

    this.cwd = opts.cwd;
    this.opts = opts;
    this.commands = {};
    this.generators = {};
  }

  async initPlugin(opts: { plugin: Plugin }) {
    // apply with PluginAPI
    const pluginAPI = new PluginAPI({
      service: this,
    });

    let ret = await opts.plugin.apply?.()(pluginAPI);

    if (ret?.presets) {
      ret.presets = ret.presets.map(
        (preset: string) =>
          new Plugin({
            path: preset,
            cwd: this.cwd,
          })
      );
    }
    if (ret?.plugins) {
      ret.plugins = ret.plugins.map(
        (plugin: string) =>
          new Plugin({
            path: plugin,
            cwd: this.cwd,
          })
      );
    }
    return ret || {};
  }

  async initPreset(opts: {
    preset: Plugin;
    presets: Plugin[];
    plugins: Plugin[];
  }) {
    const { presets, plugins } = await this.initPlugin({
      plugin: opts.preset,
    });
    opts.presets.unshift(...(presets || []));
    opts.plugins.push(...(plugins || []));
  }

  async run(opts: { name: string; args?: any }) {
    const { name, args = {} } = opts;
    args._ = args._ || [];
    // 先处理一下命令行的参数
    // shift the command itself
    if (args._[0] === name) {
      args._.shift();
    }

    // resolve initial presets and plugins
    const { plugins, presets } = Plugin.getPluginsAndPresets({
      cwd: this.cwd,
      plugins: [...this.opts.plugins!],
      presets: [...this.opts.presets!],
    });

    const presetPlugins: Plugin[] = [];

    while (presets.length) {
      await this.initPreset({
        preset: presets.shift()!,
        presets,
        plugins: presetPlugins,
      });
    }

    plugins.unshift(...presetPlugins);

    // 注册内置的 plugins
    while (plugins.length) {
      await this.initPlugin({ plugin: plugins.shift()! });
    }

    const command = this.commands[name];
    assert(command, `Invalid command ${name}, it's not registered.`);

    // run command
    const ret = await command.fn({ args });
    return ret;
  }
}
