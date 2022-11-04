import prompts from 'prompts'
import yParser from 'yargs-parser'
import resolve from 'resolve'
import chalk from 'chalk'
import * as logger from './logger'
import updatePackageJSON from './updatePackageJSON'
import generateFile from './Generator/generateFile'
import installDeps from './installDeps'

export * from './randomColor'
export * from './winPath'

export {
  chalk,
  logger,
  updatePackageJSON,
  generateFile,
  prompts,
  yParser,
  resolve,
  installDeps,
}
