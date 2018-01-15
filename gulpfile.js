var browserSync = require('browser-sync').create();
var gulp = require('gulp');
var gulpCleanCSS = require('gulp-clean-css');
var gulpConcat = require('gulp-concat');
var gulpRename = require('gulp-rename');
var gulpSass = require('gulp-sass');
var gulpUglify = require('gulp-uglify');

gulp.task('sass', function () {
  return gulp.src('frontend/scss/style.scss')
    .pipe(gulpSass())
    .pipe(gulp.dest('frontend/css'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('minify-css', ['sass'], function () {
  return gulp.src('frontend/css/style.css')
    .pipe(gulpCleanCSS({ compatibility: 'ie8' }))
    .pipe(gulpRename({ suffix: '.min' }))
    .pipe(gulp.dest('frontend/css'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('minify-js', function () {
  return gulp.src([
    'frontend/js/todo-api.js',
    'frontend/js/todo-manager.js'
  ])
    .pipe(gulpConcat('todo.js'))
    .pipe(gulpUglify())
    .pipe(gulpRename({ suffix: '.min' }))
    .pipe(gulp.dest('frontend/js'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('browser-sync', function () {
  browserSync.init({
    server: {
      baseDir: '',
      routes: {
        '/assets': 'assets',
        '/frontend': 'frontend'
      }
    }
  });
});

gulp.task('default', ['sass', 'minify-css', 'minify-js']);

gulp.task('dev', ['browser-sync', 'default'], function () {
  gulp.watch('frontend/index.html', browserSync.reload);
  gulp.watch('frontend/scss/style.scss', ['sass']);
  gulp.watch('frontend/css/style.css', ['minify-css']);
  gulp.watch('frontend/js/*.js', ['minify-js']);
});