var gulp = require('gulp'),
  autoprefixer = require('gulp-autoprefixer'),
  concat = require('gulp-concat'),
  ngAnnotate = require('gulp-ng-annotate'),
  sass = require('gulp-sass'),
  plumber = require('gulp-plumber'),
  uglify = require('gulp-uglify');

var paths = {
  css: {
    src: 'ng/static/css/src/',
    dist: 'ng/static/css/dist/',
    libs:'ng/static/css/libs/'
  },
  js: {
    src: 'ng/static/js/src/',
    dist: 'ng/static/js/dist/',
    libs: 'ng/static/js/libs/'
  }
};

var cssFiles = [paths.css.libs + '*.css', paths.css.src + '*.scss'];
var jsFiles = [paths.js.libs + '*.js', paths.js.src + '*.js'];

gulp.task('sass', function () {
  return gulp.src(cssFiles)
    .pipe(plumber())
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(autoprefixer({
      browers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(concat('isitpicnicday.css'))
    .pipe(gulp.dest(paths.css.dist));
});

gulp.task('js', function () {
  return gulp.src(jsFiles)
    .pipe(ngAnnotate())
    .pipe(concat('isitpicnicday.js'))
    .pipe(uglify({mangle: true, compress: true}))
    .pipe(gulp.dest(paths.js.dist));
});

gulp.task('watch', ['default'], function () {
  gulp.watch(paths.css.src + '*.scss', ['sass']);
  gulp.watch(paths.js.src + '*.js', ['js']);
});

gulp.task('default', ['sass', 'js']);