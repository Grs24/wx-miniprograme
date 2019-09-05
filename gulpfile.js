/**
 * *组件安装*
 * * npm i -D gulp gulp-sass gulp-rename gulp-watch *
 * 鉴于微信开发者工具自带样式补全，es6编译，代码压缩等功能，故该gulp文件只执行sass编译，图片压缩等
 * 1.sass编译打包到生产环境对微信开发工具会损耗性能，故直接原文件目录下生成wxss
 * 2.
 **/

const gulp = require("gulp")
const sass = require("gulp-sass") //sass
const rename = require("gulp-rename") //重命名
const watch = require('gulp-watch') //监听文件状态，包括新建删除
// const tinypng = require('gulp-tinypng') //熊猫图片压缩（api：mlpo9GLfJmqCRXyZpl75lEcE2UtyXxa1）

const pageDir = '.' //小程序目录

const ignorePath = "!./node_modules/**/*.scss"

// sass
gulp.task('sass', () => {
  return gulp
    .src([pageDir + '/**/*.scss', ignorePath])
    .pipe(
      sass({
        outputStyle: 'expanded'
      }).on('error', sass.logError)
    )
    .pipe(
      rename({
        extname: '.wxss'
      })
    )
    .pipe(gulp.dest(pageDir))
})

//  tinypng压缩图片,只限png,打包时再执行压缩
// gulp.task('img_min', () => {
//   return gulp.src(pageDir + 'assets/images/*.png')
//     .pipe(tinypng({
//       key: 'mlpo9GLfJmqCRXyZpl75lEcE2UtyXxa1',
//       sigFile: 'images/.tinypng-sigs',
//       log: true,
//       parallel: true
//     }))
//     .pipe(gulp.dest(pageDir))
// });

// 监听sass变化
gulp.task('watch_sass', () => {
  return watch([pageDir + '/**/*.scss', ignorePath], gulp.parallel('sass'));
})

// 开发
gulp.task(
  'dev',
  gulp.series(
    gulp.parallel("sass"), "watch_sass"
  )
)

// 打包上传,主要压缩图片
// gulp.task(
//   'build',
//   gulp.series(
//     gulp.parallel('sass', 'img_min')
//   )
// )