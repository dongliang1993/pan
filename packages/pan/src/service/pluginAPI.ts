import assert from "assert";
import { Service } from "./service";
import { Command, CommandOpts } from "./command";
import { Generator } from "../types";
import { makeArray } from "../utils";

export class PluginAPI {
  service: Service;
  generators: Record<string, Generator>;

  constructor(opts: { service: Service }) {
    this.service = opts.service;
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
  registerCommand(opts: CommandOpts & { alias?: string | string[] }) {
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
