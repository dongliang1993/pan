import { resolve, winPath } from "@lilith-plat/utils";
import { existsSync } from "fs";
import assert from "assert";

interface PluginOpts {
  path: string;
  cwd: string;
}

export class Plugin {
  private cwd: string;
  path: string;
  apply?: Function;

  constructor(opts: PluginOpts) {
    this.path = winPath(opts.path);
    this.cwd = opts.cwd;
    assert(existsSync(this.path), `Invalid ${this.path}, it's not exists.`);

    this.apply = () => {
      let ret;
      try {
        ret = require(this.path);
      } catch (e: any) {
        throw new Error(`Register ${this.path} failed, since ${e.message}`);
      } finally {
      }
      // use the default member for es modules
      return ret.__esModule ? ret.default : ret;
    };
  }

  static getPluginsAndPresets(opts: {
    cwd: string;
    plugins?: string[];
    presets?: string[];
  }) {
    function get(type: "plugin" | "preset") {
      const types = `${type}s` as "plugins" | "presets";
      return [
        // opts
        ...(opts[types] || []),
      ].map((path) => {
        assert(
          typeof path === "string",
          `Invalid plugin ${path}, it must be string.`
        );
        let resolved;
        try {
          resolved = resolve.sync(path, {
            basedir: opts.cwd,
            extensions: [".tsx", ".ts", ".mjs", ".jsx", ".js"],
          });
        } catch (_e) {
          throw new Error(`Invalid plugin ${path}, can not be resolved.`);
        }

        return new Plugin({
          path: resolved,
          cwd: opts.cwd,
        });
      });
    }

    return {
      presets: get("preset"),
      plugins: get("plugin"),
    };
  }
}
