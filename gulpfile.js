var gulp = require('gulp'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  concat = require('gulp-concat'),
  plumber = require('gulp-plumber'),
  autoprefixer = require('gulp-autoprefixer');

/* 
//keep around just in case structure changes
var paths = {
  css: {
    src: './ng/static/css/src/',
    dist: './ng/static/css/dist/',
    libs:'./ng/static/css/libs/'
  },
  js: {
    src: 'ng/static/js/src/',
    dist: 'ng/static/js/dist/',
    libs: 'ng/static/js/libs/'
  }
};
*/

var paths = {
  css: {
    src: 'ng/static/',
    dist: 'ng/static/',
    libs:'ng/static/'
  },
  js: {
    src: 'ng/static/',
    dist: 'ng/static/',
    libs: 'ng/static/'
  }
};


gulp.task('sass', function () {
  return gulp.src(paths.css.src+'**/*.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer({
      browers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(paths.css.dist));
});


gulp.task('js', function () {
  return gulp.src(paths.js.src+'**/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('pjlong.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.js.dist));
});


gulp.task('watch', function () {
  gulp.watch(paths.css.src+'**/*.scss', ['sass']);
  gulp.watch(paths.js.src+'**/*.js', ['js']);
});

gulp.task('default', ['sass']);