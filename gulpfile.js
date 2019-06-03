const gulp = require('gulp');
const uglify = require('gulp-uglify-es').default;
const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');
const sass = require('gulp-sass');
const eslint = require("gulp-eslint");
const browsersync = require('browser-sync').create();

function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "./src/"
    },
    port: 1234
  });
  done();
}

function browserSyncReload(done) {
  browsersync.reload();
  done();
}

function styles() {
    return gulp.src('./src/sass/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(cleanCSS())
      .pipe(gulp.dest('./dest/styles.css'))
      .pipe(browsersync.stream());
};

function esLint() {
  return gulp
    .src(["./src/js/**/*", "./gulpfile.js"])
    .pipe(plumber())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
} 

function scripts() {              
    return gulp.src('./src/scripts/**/*.js', { sourcemaps: true })
      .pipe(rename('main.min.js'))                      
      .pipe(uglify())                                     
      .pipe(gulp.dest('./dest/scripts.js'))   
      .pipe(browsersync.stream());                    
}

function watchFiles() {
  gulp.watch("./src/styles/**/*", styles);
  gulp.watch("./src/scripts/*/*", gulp.series(esLint, scripts));
  gulp.series(browserSyncReload);
}

const watchThis = gulp.parallel(watchFiles, browserSync);

exports.watch = watchThis;
exports.lint = gulp.series(scripts, esLint);