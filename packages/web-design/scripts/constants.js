const path = require("path");

const compiledPath = path.join(process.cwd(), 'compiled')
const libName = 'antd';
const dir = 'node_modules'
const output = path.join(process.cwd(), 'dist');
const esOutput = path.join(output, 'es');
const cjsOutput = path.join(output, 'lib');

module.exports = {
  compiledPath,
  libName,
  dir,
  output,
  esOutput,
  cjsOutput
}
