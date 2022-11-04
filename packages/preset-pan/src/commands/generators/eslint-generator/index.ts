import fs from 'fs'
import path from 'path'
import { IApi } from '../../../../../../pan/src/types'

export enum Language {
  TS = 'ts',
  JS = 'js',
}

export function isTsProject(appDir: string) {
  return fs.existsSync(path.join(appDir, 'tsconfig.json'))
}

export default (api: IApi) => {
  api.registerGenerator({
    key: 'eslint',
    name: 'Create Eslint',
    description: 'Create eslint config',
    fn: async (options) => {
      console.log(process.cwd(), __dirname, '===')
    },
  })
}
