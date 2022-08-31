const less = require('gulp-less')
const NpmImportPlugin = require('less-plugin-npm-import')
const LessAutoprefix = require('less-plugin-autoprefix')

const npmImport = new NpmImportPlugin({ prefix: '~' });
const autoprefix = new LessAutoprefix();

const {
  DIR_NAME_ESM,
  DIR_NAME_CJS,
  DIR_NAME_UMD,
  DIR_NAME_SOURCE,
  LIBRARY_NAME
} = require('./constants')

const config = {
  css: {
    entry: [`${DIR_NAME_SOURCE}/**/index.less`],
    output: {
      es: DIR_NAME_ESM,
      cjs: DIR_NAME_CJS,
      dist: {
        path: `${DIR_NAME_UMD}/`,
        cssFileName: `${LIBRARY_NAME}.css`,
        rawFileName: `index.less`,
      },
    },
    compiler: less,
    compilerOptions: {
      paths: ['node_modules'],
      plugins: [npmImport, autoprefix],
      relativeUrls: true,
      javascriptEnabled: true,
    },
  },
  asset: {
    output: `${DIR_NAME_UMD}}`,
  },
  jsEntry: {
    entry: [`${DIR_NAME_SOURCE}/style/index.ts`, `${DIR_NAME_SOURCE}/*/style/index.ts`],
    styleSheetExtension: 'less',
    rawEntryFileName: '',
    cssEntryFileName: '',
  },
}

module.exports = config