'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'del', 'browser-sync']
});

gulp.task('images', function () {
    return gulp.src(
        ['src/images/**/*.{ico,gif,jpg,jpeg,png,svg}'])
        .pipe(gulp.dest( 'dist/images' ));
});

gulp.task('fonts', function () {
    return gulp.src('src/fonts/**/*.{eot,svg,ttf,woff,woff2}')
        .pipe(gulp.dest( 'dist/fonts' ));
});

gulp.task('css', function () {
    gulp.src([
            'src/css/typography.css',
            'node_modules/bootstrap/dist/css/bootstrap.css',
            'src/css/**/*.css'
        ])
        .pipe($.concatCss('wappa-uikit.css'))
        .pipe(gulp.dest('dist/css/'))
        .pipe($.concatCss('wappa-uikit.min.css'))
        .pipe($.stripCssComments( { all: true } ))
        .pipe($.cssmin())
        .pipe(gulp.dest('dist/css/'));
});

gulp.task('browser-sync', function () {
    $.browserSync.instance = $.browserSync.init(
        [
            'docs/**/*.html',
            'docs/css/**/*.css',
            'docs/images/**/*.{ico,gif,jpg,jpeg,png,svg}'
        ], {
            startPath: 'index.html',
            server: {
                baseDir: './'
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

//inserir o código abaixo nos gulpfile.js das aplicações 
gulp.task('wappa-uikit', function() {
    gulp.src('bower_components/wappa-uikit/dist/images/**/*.{ico,gif,jpg,jpeg,png,svg}')
        .pipe(gulp.dest('dist/images/'));

    gulp.src('bower_components/wappa-uikit/dist/fonts/**/*.{eot,svg,ttf,woff,woff2}')
        .pipe(gulp.dest( 'dist/fonts/' ));
});
