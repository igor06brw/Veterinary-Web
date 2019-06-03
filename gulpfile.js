const gulp = require('gulp');
const uglify = require('gulp-uglify-es').default;
const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');
const sass = require('gulp-sass');
const eslint = require("gulp-eslint");
const postCSS = require('gulp-postcss');
const autoprefixer = require('gulp-autoprefixer');
const plumber = require('gulp-plumber');
const browsersync = require('browser-sync').create();

function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "./"
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
    return gulp.src('./src/styles/**/*.scss')
      .pipe(sass({ outputStyle: "expanded" }).on('error', sass.logError))
      .pipe(gulp.dest('./dest/styles/'))  
      // .pipe(rename({ suffix: ".min" }))  // COMING SOON
      // .pipe(autoprefixer())
      // .pipe(cleanCSS())
      // .pipe(postCSS())
      // .pipe(gulp.dest("./dest/styles/"))
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