const gulp = require('gulp'),
  gulpif = require('gulp-if'),
  uglify = require('gulp-uglify'),
  del = require('del'),
  data = require('gulp-data'),
  sass = require('gulp-sass'),
  imagemin = require('gulp-imagemin'),
  concat = require('gulp-concat'),
  browserSync = require('browser-sync').create(),
  nunjucksRender = require('gulp-nunjucks-render'),
  gulpStylelint = require('gulp-stylelint')
  cssbeautify = require('gulp-cssbeautify');

const basePath = {
  src: 'srcMain/',
  dest: 'src/'
};

let isProd = false;

const srcAssets = {
  styles: basePath.src + 'styles/',
  images: basePath.src + 'images/',
  assets: basePath.src + 'assets/',
  fonts: basePath.src + 'fonts/',
  modules: 'node_modules/',
  root: basePath.src
};

const destAssets = {
  styles: basePath.dest + 'styles/',
  scripts: basePath.dest + 'js/',
  images: basePath.dest + 'images/',
  assets: basePath.dest + 'assets/',
  fonts: basePath.dest + 'fonts/',
  root: basePath.dest
};

gulp.task('set-prod', function () {
  isProd = true;
});

gulp.task('styles', function () {
  gulp.src(srcAssets.styles + 'style.scss')
    .pipe(sass({
      sourceMap: 'sass',
      outputStyle: 'nested'
    }))
    .on('error', sass.logError)
    .pipe(cssbeautify({
      indent: '  ',
    }))
    .pipe(gulpStylelint({
      fix: true
    }))
    .pipe(gulp.dest(destAssets.styles))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('images', function () {
  return gulp.src([srcAssets.images + '**/*.+(png|jpg|gif|svg)', srcAssets.assets + '**/*.+(png|jpg|gif|svg)'])
    .pipe(gulpif(isProd, imagemin({
      interlaced: true
    })))
    .pipe(gulp.dest(destAssets.images))
});

gulp.task('clean', function () {
  return del.sync(destAssets.root);
});

gulp.task('browserSync', function () {
  browserSync.init({
    server: {
      baseDir: destAssets.root
    },
  })
});

gulp.task('copy', function () {
  return gulp.src([srcAssets.images + '**/*.+(png|jpg|gif|svg)', srcAssets.assets + '**/*.+(png|jpg|gif|svg)'])
    .pipe(gulp.dest(destAssets.images))
});

gulp.task('copy-fonts', function () {
  return gulp.src([srcAssets.fonts + '*.+(eot|ttf|woff|woff2)'])
    .pipe(gulp.dest(destAssets.fonts))
});

gulp.task('template', function () {
  return gulp.src(srcAssets.root + 'views/pages/**/*.+(html|nunjucks|njk)')
    .pipe(nunjucksRender({
      path: [srcAssets.root + 'views/']
    }))
    .pipe(gulp.dest(destAssets.root))
});

gulp.task('watch', ['copy', 'copy-fonts', 'styles', 'template', 'browserSync'], function () {
  gulp.watch(srcAssets.images + '**/*.+(png|jpg|gif|svg)', ['copy']);
  gulp.watch(srcAssets.styles + '**/*.+(scss|sass|css)', ['styles']);
  gulp.watch(srcAssets.root + '**/*.+(html|nunjucks|njk)', ['template', browserSync.reload]);
});

gulp.task('default', ['clean', 'images', 'styles', 'template', 'watch']);

gulp.task('build', ['default']);

gulp.task('production', ['set-prod', 'clean', 'images', 'styles', 'template']);
