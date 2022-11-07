import { chalk } from '@pan/utils'
import { IApi } from '../types'

export default (api: IApi) => {
  api.registerCommand({
    name: 'plugin',
    description: 'inspect pan plugins',
    fn({ args }) {
      const command = args._[0]

      if (!command) {
        throw new Error(`
Sub command not found: pan plugin
Did you mean:
  pan plugin list
        `)
      }

      switch (command) {
        case 'list':
          getPluginList()
          break
        default:
          throw new Error(`Unsupported sub command ${command} for pan plugin.`)
      }

      function getPluginList() {
        Object.keys(api.service.plugins).forEach((pluginId: string) => {
          const plugin = api.service.plugins[pluginId]
          if (plugin.id.startsWith('@pan/preset'))
            return console.info(
              `- ${plugin.id} ${chalk.cyanBright('(from preset)')}`
            )
          console.info(`- ${plugin.id}`)
        })
      }
    },
  })
}
