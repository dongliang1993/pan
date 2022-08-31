const gulp = require('gulp')
const rename = require('gulp-rename');
const del = require('del');

const { UMD_BUNDLE_NAME, DIR_NAME_UMD, DEFAULT_UMD_BUNDLE_NAME } = require('./constants')

async function renameUMD() {
  return new Promise((resolve, reject) => {
    gulp
      .src(`${DIR_NAME_UMD}/${DEFAULT_UMD_BUNDLE_NAME}`, {
        allowEmpty: true,
      })
      .pipe(
        rename({
          basename: `${UMD_BUNDLE_NAME}`,
          extname: '.js',
        })
      )
      .pipe(gulp.dest(DIR_NAME_UMD))
      .on('end', async () => {
        try {
          await del(`${DIR_NAME_UMD}/${DEFAULT_UMD_BUNDLE_NAME}`);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
  })
}

function delUMD() {
  del.sync([`${DIR_NAME_UMD}/${DEFAULT_UMD_BUNDLE_NAME}`], { force: true })
}

function run() {
  renameUMD().then(() => {
    console.log('rename success')
  }).catch(console)
}

run()