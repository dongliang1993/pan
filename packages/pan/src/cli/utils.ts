import { logger } from '@pan/utils'

import { MIN_NODE_VERSION } from '../constants'

/**
 * 检查 node 版本，最低支持 14
 */
export function checkNodeVersion() {
  const v = parseInt(process.version.slice(1))

  if (v < MIN_NODE_VERSION) {
    logger.error(
      `Your node version ${v} is not supported, please upgrade to ${MIN_NODE_VERSION} or above.`
    )
    process.exit(1)
  }
}
