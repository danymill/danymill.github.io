'use strict';

const gulp = require('gulp');
const stylus = require('gulp-stylus');
const resolver = require('stylus').resolver;
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const gulpIf = require('gulp-if');
const autoprefixer = require('gulp-autoprefixer');
const notify = require('gulp-notify');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const svgSprite = require('gulp-svg-sprite');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const cssnano = require('gulp-cssnano');
const rev = require('gulp-rev');
const revReplace = require('gulp-rev-replace');
const combine = require('stream-combiner2').obj;

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV == 'dev';

gulp.task('styles', function() {
  return gulp.src('src/stylesheets/*.styl')
    .pipe(gulpIf(isDev, sourcemaps.init()))
    .pipe(stylus({
      import: process.cwd() + '/tmp/styles/sprite',
      define: {
        url: resolver()
      }
    }))
    .on('error', notify.onError(function(err) {
      return {
        title: 'Styles',
        message: err.message
      }
    }))
    .pipe(autoprefixer())
    .pipe(gulpIf(isDev, sourcemaps.write()))
    .pipe(gulpIf(!isDev, combine(cssnano(), rev())))
    .pipe(gulp.dest('css'))
    .pipe(gulpIf(!isDev, combine(rev.manifest('css.json'), gulp.dest('manifest'))));
});

gulp.task('styles:svg', function() {
  return gulp.src('src/stylesheets/**/*.svg')
    .pipe(svgSprite({
      mode: {
        css: {// Create a «css» sprite
          dest: '.',
          bust: !isDev,
          sprite: 'sprite.svg',
          layout: 'vertical',
          prefix: '$',
          dimensions: false,
          render: {
            styl: {
              dest: 'sprite.styl'
            }
          }
        }
      }
    }))
    .pipe(gulpIf('*.styl', gulp.dest('tmp/styles'), gulp.dest('css')));
});

gulp.task('styles:assets', function() {
  return gulp.src('src/stylesheets/**/*.{png, jpg}', {since: gulp.lastRun('styles:assets')})
    .pipe(newer('.'))
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest('css'));
});

gulp.task('images', function() {
  return gulp.src('src/stylesheets/**/*.{png, jpg}', {since: gulp.lastRun('images')})
    .pipe(newer('.'))
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest('.'));
});

gulp.task('assets', function() {
  return gulp.src(['src/assets/**', '!src/stylesheets/**/*.{png, jpg}'], {since: gulp.lastRun('assets')})
    .pipe(gulpIf(!isDev, revReplace({
      manifest: gulp.src('manifest/css.json', {allowEmpty: true})
    })))
    .pipe(gulp.dest('.'));
});

gulp.task('scripts', function() {
  return gulp.src('src/javascripts/**/*.js')
    // .pipe(gulpIf(!isDev, rename({suffix: '.min'})))
    .pipe(gulpIf(!isDev, uglify()))
    .pipe(gulp.dest('js'))
});

gulp.task('clean', function() {
  return del(['css', 'js', 'images', 'manifest']);
});

gulp.task('build', gulp.series(
  'clean',
  gulp.parallel(
    'styles:svg',
    'styles:assets',
    'styles',
    'images',
    'assets',
    'scripts'
  )
));

gulp.task('watch', function() {
  gulp.watch(['src/stylesheets/**/*.styl', 'tmp/styles/sprite.styl'], gulp.series('styles'));
  gulp.watch('src/stylesheets/**/*.svg', gulp.series('styles:svg'));
  gulp.watch('src/stylesheets/**/*.{png, jpg}', gulp.series('styles:assets'));
  gulp.watch('src/assets/**', gulp.series('assets'));
  gulp.watch('src/javascripts/**', gulp.series('scripts'));
});

gulp.task('dev', gulp.series('build', 'watch'));

gulp.task('default', gulp.series('build'));