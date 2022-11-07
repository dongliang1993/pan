import { logger } from '@pan/utils'

import bundless from './bundless'
import { IApi } from '../types'

interface IBuilderOpts {
  // userConfig: IFatherConfig
  cwd: string
  pkg: IApi['pkg']
  clean?: boolean
  quiet?: boolean
  buildDependencies?: string[]
}

async function builder(opts: IBuilderOpts & { watch?: true }) {
  // const configProviders = createConfigProviders(
  //   opts.userConfig,
  //   opts.pkg,
  //   opts.cwd
  // )
  // const outputs = getProviderOutputs(configProviders)
  // if (opts.clean !== false) {
  //   // clean output directories
  //   logger.info('Clean output directories')
  //   outputs.forEach((output) => {
  //     rimraf.sync(path.join(opts.cwd, output))
  //   })
  // }
  // if (!opts.watch && configProviders.bundle) {
  //   await bundle({
  //     cwd: opts.cwd,
  //     configProvider: configProviders.bundle,
  //     buildDependencies: opts.buildDependencies,
  //   })
  // }
  // if (configProviders.bundless.esm) {
  //   const watcher = await bundless({
  //     cwd: opts.cwd,
  //     configProvider: configProviders.bundless.esm,
  //     watch: opts.watch,
  //     quiet: opts.quiet,
  //   })
  // }
  // if (configProviders.bundless.cjs) {
  // const watcher = await bundless({
  //   cwd: opts.cwd,
  //   configProvider: configProviders.bundless.cjs,
  //   // watch: opts.watch,
  //   // quiet: opts.quiet,
  // })
  // }
}

export default builder
