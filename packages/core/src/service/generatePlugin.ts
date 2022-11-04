import {
  prompts,
  generateFile,
  installDeps,
  updatePackageJSON,
} from '@pan/utils'
import { PluginAPI } from './pluginAPI'

import { Generator as IGenerator } from './generator'

// 内置的 plugin
// 用来注册微生成器命令
export default (api: PluginAPI) => {
  api.registerCommand({
    name: 'generate',
    alias: 'g',
    description: 'generate code snippets quickly',
    async fn({ args }) {
      // type 是 -generate xxx  yyy 第一个参数
      // 比如 pan g page 中的 page
      const [type] = args._

      const runGenerator = async (generator: IGenerator) => {
        await generator?.fn({
          args,
          installDeps,
          generateFile,
          updatePackageJSON,
        })
      }

      // 如果有微生成器的类型
      if (type) {
        const generator = api.service.generators[type] as IGenerator
        if (!generator) {
          throw new Error(`Generator ${type} not found.`)
        }
        await runGenerator(generator)
      } else {
        const getEnableGenerators = async (
          generators: typeof api.service.generators
        ) => {
          const questions = [] as { title: string; value: string }[]
          for (const key of Object.keys(generators)) {
            const g = generators[key] as IGenerator

            questions.push({
              title: `${g.name} -- ${g.description}` || '',
              value: g.key,
            })
          }
          return questions
        }
        const questions = await getEnableGenerators(api.service.generators)
        const { gType } = await prompts({
          type: 'select',
          name: 'gType',
          message: 'Pick generator type',
          choices: questions,
        })
        await runGenerator(api.service.generators[gType])
      }
    },
  })
}
