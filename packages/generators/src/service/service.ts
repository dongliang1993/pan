import assert from "assert";
import { PluginAPI } from "./PluginAPI";
import { Command } from "./command";

import generatePlugin from "./generatePlugin";

import page from "../commands/generators/page";

import { Plugin } from "../types";

interface IOpts {
  cwd: string;
}

export class Service {
  cwd: string;
  opts: IOpts;
  commands: Record<string, Command> = {};
  generators: Record<string, Generator> = {};

  constructor(opts: IOpts) {
    this.cwd = opts.cwd;
    this.opts = opts;
    this.commands = {};
    this.generators = {};
  }

  async initPlugin(opts: { plugin: Plugin }) {
    // apply with PluginAPI
    const pluginAPI = new PluginAPI({
      plugin: opts.plugin,
      service: this,
    });
    let ret = await opts.plugin(pluginAPI);

    return ret || {};
  }

  async run(opts: { name: string; args?: any }) {
    const { name, args = {} } = opts;
    args._ = args._ || [];
    // shift the command itself
    if (args._[0] === name) args._.shift();

    // 注册内置的 plugins
    const plugins = [generatePlugin, page] as Plugin[];
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
