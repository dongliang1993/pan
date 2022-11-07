import { logger, installDeps } from '@pan/utils'
import { existsSync, readFileSync, writeFileSync } from 'fs'

import { IApi } from '../../types'

export const addDevDeps = (api: IApi, deps: Record<string, string>) => {
  api.pkg.devDependencies = {
    ...api.pkg.devDependencies,
    ...deps,
  }
  writeFileSync(api.pkgPath, JSON.stringify(api.pkg, null, 2))
  logger.info('Update package.json for devDependencies')
}
