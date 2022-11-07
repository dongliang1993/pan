import { IApi } from '../types'

export default (api: IApi) => {
  api.registerCommand({
    name: 'version',
    alias: 'v',
    description: 'show pan version',
    fn({}) {
      const version = require('../../package.json').version
      console.log(`pan@${version}`)
      console.log(Date.now())
      return version
    },
  })
}
