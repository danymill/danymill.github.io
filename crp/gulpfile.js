'use strict';

var gulp = require('gulp'),
  autoprefixer = require('gulp-autoprefixer'),
  cssnano = require('gulp-cssnano'),
  imagemin = require('gulp-imagemin'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify'),
  del = require('del'),
  newer = require('gulp-newer'),
  notify = require('gulp-notify');

gulp.task('styles', function() {
  return gulp.src('src/**/*.css')
    .pipe(autoprefixer('last 2 version'))
    .pipe(rename({suffix: '.min'}))
    .pipe(cssnano())
    .pipe(gulp.dest('.'))
    .pipe(notify({ message: 'Styles task complete' }));
});

gulp.task('scripts', function() {
  return gulp.src('src/**/*.js')
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('.'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('images', function() {
  return gulp.src(['src/**/*.png', 'src/**/*.jpg'])
    .pipe(newer('.'))
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest('.'))
    .pipe(notify({ message: 'Images task complete' }));
});

gulp.task('clean', function() {
  return del(['css', 'js', 'img', 'views/css', 'views/js', 'views/images']);
});

gulp.task('default', ['clean'], function() {
  gulp.start('styles', 'scripts', 'images');
});

gulp.task('watch', function() {

  // Watch .scss files
  gulp.watch('src/**/*.css', ['styles']);

  // Watch .js files
  gulp.watch('src/**/*.js', ['scripts']);

  // Watch image files
  gulp.watch('src/**/*', ['images']);

});