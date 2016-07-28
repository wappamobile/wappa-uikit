'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync').create();

var clean = require('gulp-clean');
var cssmin = require('gulp-cssmin');
var concatCss = require('gulp-concat-css');
var stripCssComments = require('gulp-strip-css-comments');

var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

gulp.task('styles', function () {
    return gulp.src([
            'src/bower/bootstrap/dist/css/bootstrap.css',
            'src/styles/**/*.css',
            '!src/guideline.css',
            '!src/docs.css'
        ])
        .pipe(concatCss('wappa-uikit.min.css'))
        .pipe(stripCssComments( { all: true } ))
        .pipe(cssmin())
        .pipe(gulp.dest( 'dist' ));
});

gulp.task('browser-sync', function () {
    browserSync.instance = browserSync.init(
        [
            'src/**/*.html',
            'src/styles/**/*.css',
            'src/scripts/**/*.js',
            'src/images/**/*'
        ], {
            startPath: '/index.html',
            server: {
                baseDir: 'src'
            },
            host: "0.0.0.0"
        }
    );
});

gulp.task('serve', ['browser-sync']);

gulp.task('build', ['styles']);