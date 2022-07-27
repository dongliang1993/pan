import { yParser } from "@lilith-plat/utils";

export interface IOpts {
  name: string;
  description?: string;
  options?: string;
  details?: string;
  fn: {
    ({ args }: { args: yParser.Arguments }): void;
  };
}

export class Command {
  name: string;
  description?: string;
  options?: string;
  details?: string;
  fn: {
    ({ args }: { args: yParser.Arguments }): void;
  };
  constructor(opts: IOpts) {
    this.name = opts.name;
    this.description = opts.description;
    this.options = opts.options;
    this.details = opts.details;
    this.fn = opts.fn;
  }
}
