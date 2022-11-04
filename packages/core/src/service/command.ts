import { yParser } from '@pan/utils'

export interface CommandOpts {
  name: string
  description?: string
  options?: string
  details?: string
  // command 执行函数
  fn: {
    ({ args }: { args: yParser.Arguments }): void
  }
}

/**
 * Command 的实例对应命令行的一个指令
 */
export class Command {
  name: string
  description?: string
  options?: string
  details?: string
  fn: {
    ({ args }: { args: yParser.Arguments }): void
  }
  constructor(opts: CommandOpts) {
    this.name = opts.name
    this.description = opts.description
    this.options = opts.options
    this.details = opts.details
    this.fn = opts.fn
  }
}
