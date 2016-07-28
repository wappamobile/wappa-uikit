'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'del', 'browser-sync']
});

gulp.task('images', function () {
    return gulp.src(
        [
            'src/images/**/*.{ico,gif,jpg,jpeg,png,svg}',
            "!src/images/docs{/**,}",
        ])
        .pipe(gulp.dest( 'dist/images' ));
});

gulp.task('fonts', function () {
    return gulp.src('src/fonts/**/*.{eot,svg,ttf,woff,woff2}')
        .pipe(gulp.dest( 'dist/fonts' ));
});

gulp.task('css', function () {
    return gulp.src([
            '!src/bower/bootstrap/dist/css/bootstrap.css',
            'src/css/**/*.css',
            '!src/guideline.css',
            '!src/docs.css'
        ])
        .pipe($.concatCss('wappa-uikit.min.css'))
        .pipe($.stripCssComments( { all: true } ))
        .pipe($.cssmin())
        .pipe(gulp.dest( 'dist/css/' ));
});

gulp.task('browser-sync', function () {
    $.browserSync.instance = $.browserSync.init(
        [
            'src/**/*.html',
            'src/css/**/*.css',
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

gulp.task('clean', function(done) {
    $.del(['dist'], done);
});

gulp.task('serve', ['browser-sync']);

gulp.task('build', ['clean'], function () {
    gulp.start('css', 'fonts', 'images');
});