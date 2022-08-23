const path = require('path')
const glob = require('fast-glob');
const fs = require('fs-extra');
const { logger } = require('@lilith-plat/utils')

const { compiledPath, esOutput } = require('./constants');

const baseMerge = async (output) => {
  // merge components
  const componentPaths = await glob(path.join(`${compiledPath}/*`), { onlyDirectories: true })
  for (const componentPath of componentPaths) {
    const componentName = path.basename(componentPath);
    if (fs.pathExistsSync(path.join(output, componentName))) {
      logger.warn(`skip component: ${componentName}, because it already exists in your own components`);
    } else {
      logger.info(`copy component: ${componentName}`);
      await fs.copySync(componentPath, path.join(output, componentName))
    }
  }

  // merge index.d.ts
  const tsFilePaths = await glob(path.join(`${compiledPath}/*.d.ts`));
  for (const tsFilePath of tsFilePaths) {
    const tsFileName = path.basename(tsFilePath);
    if (fs.pathExistsSync(path.join(output, tsFileName))) {
      let content = fs.readFileSync(path.join(output, tsFileName), 'utf8');
      content = content + fs.readFileSync(tsFilePath, 'utf8');
      fs.writeFileSync(path.join(output, tsFileName), content, 'utf-8')
    } else {
      await fs.copySync(tsFilePath, path.join(output, tsFileName))
    }
  }

  // merge index.js
  const jsFilePaths = await glob(path.join(`${compiledPath}/*.js`));
  for (const jsFilePath of jsFilePaths) {
    const jsFileName = path.basename(jsFilePath);
    if (fs.pathExistsSync(path.join(output, jsFileName))) {
      let content = fs.readFileSync(path.join(output, jsFileName), 'utf8');
      content = content + fs.readFileSync(jsFilePath, 'utf8');
      fs.writeFileSync(path.join(output, jsFileName), content, 'utf-8')
    } else {
      await fs.copySync(jsFilePath, path.join(output, jsFileName))
    }
  }

}

(async () => {
  await baseMerge(esOutput)
  // await baseMerge(cjsOutput)
  // // copy antd.config.js
  // const temp = await glob(`${esOutput}/antd-config.(js|d.ts)`)
  // for (const filePath of temp) {
  //   const fileName = path.basename(filePath);
  //   await fs.copyFileSync(filePath, path.join(esOutput, '..', fileName))
  // }
})().catch(error => {
  console.error(error);
  process.exit(1);
});;
