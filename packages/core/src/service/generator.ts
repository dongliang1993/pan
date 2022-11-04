import { generateFile } from '@pan/utils'

export enum GeneratorType {
  generate = 'generate',
  enable = 'enable',
}

type IGeneratorOptsWithoutEnableCheck = {
  key: string
  name: string
  description: string
  type: GeneratorType.generate
  fn: {
    (opts: {
      args: any
      generateFile: typeof generateFile
      updatePackageJSON: {
        (opts: { opts: object; cwd?: string }): void
      }
      installDeps: {
        (opts: {
          opts: {
            devDependencies?: string[]
            dependencies?: string[]
          }
          cwd?: string
        }): void
      }
    }): void
  }
  // plugin: Plugin
}

export type Generator = IGeneratorOptsWithoutEnableCheck
