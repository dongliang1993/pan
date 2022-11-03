import { Service as CoreService } from '@pan/core'

export class Service extends CoreService {
  constructor(opts?: any) {
    const cwd = process.cwd()

    super({
      ...opts,
      env: process.env.NODE_ENV,
      cwd,
    })
  }

  async run2(opts: { name: string; args?: any }) {
    return await this.run({ ...opts })
  }
}
