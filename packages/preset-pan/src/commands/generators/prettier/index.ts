import { GeneratorType } from '@pan/core'
import { logger, installDeps } from '@pan/utils'
import { writeFileSync } from 'fs'
import { join } from 'path'

import { IApi } from '../../../types'

export default (api: IApi) => {
  api.registerGenerator({
    key: 'prettier',
    name: 'Enable Prettier',
    description: 'Setup Prettier Configurations',
    type: GeneratorType.generate,
    fn: async () => {
      // 2、添加 .prettierrc 和 .prettierignore
      writeFileSync(
        join(api.cwd, '.prettierrc'),
        `
{
  "printWidth": 80,
  "singleQuote": true,
  "trailingComma": "all",
  "proseWrap": "never",
  "overrides": [{ "files": ".prettierrc", "options": { "parser": "json" } }],
  "plugins": ["prettier-plugin-organize-imports", "prettier-plugin-packagejson"]
}
`.trim()
      )
      logger.info('Write .prettierrc')
      writeFileSync(
        join(api.cwd, '.prettierignore'),
        `
node_modules
.dist
`.trim()
      )
      logger.info('Write .prettierignore')

      installDeps({
        opts: { devDependencies: ['prettier', 'prettier-plugin-organize-imports', 'prettier-plugin-packagejson'] },
        cwd: api.cwd,
      })
    },
  })
}
