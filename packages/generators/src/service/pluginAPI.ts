import assert from "assert";
import { Service } from "./service";
import { Command, IOpts as ICommandOpts } from "./command";
import { Generator, Plugin } from "../types";
import { makeArray } from "../utils";

export class PluginAPI {
  service: Service;
  plugin: Plugin;
  generators: Record<string, Generator>;

  constructor(opts: { service: Service; plugin: Plugin }) {
    this.service = opts.service;
    this.plugin = opts.plugin;
    this.generators = {};
  }

  registerGenerator(opts: Generator) {
    const { key } = opts;
    assert(
      !this.service.generators[key],
      `api.registerGenerator() failed, the generator ${key} is exists.`
    );
    this.service.generators[key] = {
      ...opts,
    } as Generator;
  }

  /**
   * 注册命令行指令，比如 generate
   * @param opts
   */
  registerCommand(opts: ICommandOpts & { alias?: string | string[] }) {
    const { alias, name } = opts;
    delete opts.alias;

    this.service.commands[name] = new Command({
      ...opts,
    });

    if (alias) {
      const aliases = makeArray(alias);
      aliases.forEach((alias) => {
        this.service.commands[alias] = new Command({
          ...opts,
          name: alias,
        });
      });
    }
  }
}
