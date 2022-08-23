const fs = require('fs-extra');
const path = require('path');
const glob = require('fast-glob');

const { compiledPath, libName, dir } = require('./constants');
const G = require('glob');

const getAntdPath = (base) => {
  let _base = base;

  while (!fs.ensureDirSync(path.join(_base, dir, libName))) {
    _base = path.join(_base, '..');
  }
  return path.join(_base, dir, libName);
};

/**
 * 编译打包 antd 中的每一个组件
 */
(async () => {
  const base = process.cwd();
  const directory = `${path.join(base, '../../', dir, libName)}`;
  fs.copySync(path.join(directory, 'es'), compiledPath);
  // fs.copySync(path.join(directory, 'lib'), compiledPath)
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
