import { defineConfig } from 'dumi';

import pkg from './package.json';

export default defineConfig({
  title: 'web-design',
  favicon:
    'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  logo: 'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  outputPath: 'docs-dist',
  mode: 'site',
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: pkg.name,
        customStyleName: (name) => {
          return `${pkg.name}/es/${name}/style/index.less`;
        },
      },
      pkg.name,
    ],
  ],
});
