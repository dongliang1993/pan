const pkg = require('../package.json')
const DIR_NAME_ESM = 'es'
const DIR_NAME_CJS = 'lib'
const DIR_NAME_UMD = 'dist'
const DIR_NAME_SOURCE = 'src'
const FILENAME_STYLE_ENTRY_CSS = 'css.js'
const LIBRARY_NAME = 'dp-ui';
const UMD_BUNDLE_NAME = `${LIBRARY_NAME}.min`
const DEFAULT_UMD_BUNDLE_NAME = `${pkg.name.slice('@lilith-plat/'.length)}.min.js`

module.exports = {
  DIR_NAME_ESM,
  DIR_NAME_CJS,
  DIR_NAME_UMD,
  DIR_NAME_SOURCE,
  FILENAME_STYLE_ENTRY_CSS,
  LIBRARY_NAME,
  DEFAULT_UMD_BUNDLE_NAME,
  UMD_BUNDLE_NAME
}
