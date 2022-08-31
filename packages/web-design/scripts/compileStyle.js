const gulp = require('gulp')
const glob = require('glob')
const path = require('path')
const fs_extra = require('fs-extra')
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const mergeStream = require('merge-stream');
const gulpIf = require('gulp-if');
const cleanCSS = require('gulp-clean-css');
const styleConfig = require('./style.config')

const { FILENAME_STYLE_ENTRY_CSS, LIBRARY_NAME } = require('./constants')
const { css: cssConfig, asset: assetConfig, jsEntry: jsEntryConfig } = styleConfig;

// Compile less, and output css to at es/lib
function compileLess() {
  const destDirs = [cssConfig.output.es, cssConfig.output.cjs].filter((path) => path);

  if (destDirs.length) {
    let stream = gulp
      .src(cssConfig.entry, { allowEmpty: true })
      .pipe(cssConfig.compiler(cssConfig.compilerOptions))
    destDirs.forEach((dir) => {
      stream = stream.pipe(gulp.dest(dir));
    });

    return stream.on('error', (error) => {
      console.log('Failed to build css, error in compiling less');
      console.error(error);
    });
  }
}

function copyLess() {
  return gulp
    .src(cssConfig.entry, { allowEmpty: true })
    .pipe(gulp.dest(cssConfig.output.es))
    .pipe(gulp.dest(cssConfig.output.cjs));
}

function compileCssJsEntry() {
  return mergeStream(jsEntryConfig.entry.map((entry) => gulp.src(jsEntryConfig.entry, {
    allowEmpty: true,
    base: entry.replace(/(\/\*{1,2})*\/style\/index\.[jt]s$/, ''),
  })))
    .pipe(replace(`.${jsEntryConfig.styleSheetExtension}`, '.css'))
    .pipe(
      // import './index.css' => import './index.css'
      // import '../es/Button/style' => import '../es/Button/style/css.js'
      replace(/import\s+'(.+(?:\/style)?)(?:\/index.[jt]s)?'/g, (_, $1) => {
        const suffix = $1.endsWith('/style') ? '/css.js' : '';
        return module === 'es' ? `import '${$1}${suffix}'` : `require('${$1}${suffix}')`;
      })
    )
    .pipe(
      rename(function (path) {
        const [basename, extname] = FILENAME_STYLE_ENTRY_CSS.split('.');

        path.basename = basename;
        path.extname = `.${extname}`;
      })
    )
    .pipe(gulp.dest(cssConfig.output.es))
    .pipe(gulp.dest(cssConfig.output.cjs))
}

// Dist all less files to dist
function distLess() {
  const { path: distPath, rawFileName } = cssConfig.output.dist;
  let entries = []

  cssConfig.entry.forEach((e) => {
    entries = entries.concat(glob.sync(e));
  });

  if (entries.length) {
    const texts = [];
    entries.forEach((entry) => {
      // Remove the first level directory
      const esEntry = 'es' + entry.slice(entry.indexOf('/'));
      const relativePath = path.relative('dist', esEntry);
      const text = `@import "${relativePath}";`;
      if (esEntry.startsWith(`${cssConfig.output.es}/style`)) {
        texts.unshift(text);
      } else {
        texts.push(text);
      }
    });
    fs_extra.outputFileSync(`${distPath}/${LIBRARY_NAME}.less`, texts.join('\n'));
  }
}

// Compile the packaged less into css
function distCss() {
  const { path: distPath, rawFileName, cssFileName } = cssConfig.output.dist;
  let stream = gulp.src(`${distPath}/${rawFileName}`, { allowEmpty: true });
  stream = stream.pipe(cssConfig.compiler(cssConfig.compilerOptions));

  return stream
    .pipe(
      // The less file in the /dist is packaged from the less file in /es, so its static resource path must start with ../es
      replace(
        new RegExp(`(\.{2}\/)+${cssConfig.output.es}`, 'g'),
        path.relative(cssConfig.output.dist.path, assetConfig.output)
      )
    )
    .pipe(gulpIf(true, cleanCSS()))
    .pipe(rename(cssFileName))
    .pipe(gulp.dest(distPath))
    .on('error', (error) => {
      console.error('Failed to build css, error in dist all css');
      console.error(error);
    });
}

function build() {
  new Promise((resolve) => {
    console.log('Start to build css...');
    gulp.series(
      gulp.parallel(copyLess),
      gulp.parallel(compileLess, compileCssJsEntry),
      gulp.parallel(distLess, distCss),
      gulp.parallel(() => resolve(null))
    )(null)
  }).then(
    () => console.log('Build css success!'),
    (error) => {
      throw error;
    }
  );

}

build()