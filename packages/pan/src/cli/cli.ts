import { yParser, logger } from '@pan/utils'

import { Service } from '../service/service'
import { checkNodeVersion } from './utils'

export async function run() {
  checkNodeVersion()

  const args = yParser(process.argv.slice(2), {
    alias: {
      version: ['v'],
      help: ['h'],
    },
    boolean: ['version'],
  })
  const command = args._[0] as string

  try {
    await new Service().run2({
      name: command,
      args,
    })
  } catch (e: any) {
    logger.fatal(e)
    process.exit(1)
  }
}

run()
