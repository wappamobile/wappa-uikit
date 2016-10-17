'use strict';

var gulp = require('gulp');
var exec = require('child_process').exec;
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
            'docs/images/**/*.{ico,gif,jpg,jpeg,png,svg}',
            'src/css/**/*.css'
        ], {
            startPath: 'docs/index.html',
            server: {
                baseDir: './'
            },
            host: '0.0.0.0'
        }
    );
});

gulp.task('clean', function(done) {
    $.del(['dist'], done);
});

gulp.task('serve', ['browser-sync']);

gulp.task('icomoon-update', function (cb) {
    exec('curl https://i.icomoon.io/public/daf89d25ac/WappaIcons/icomoon.eot > src/fonts/icomoon.eot');
    exec('curl https://i.icomoon.io/public/daf89d25ac/WappaIcons/icomoon.svg > src/fonts/icomoon.svg');
    exec('curl https://i.icomoon.io/public/daf89d25ac/WappaIcons/icomoon.ttf > src/fonts/icomoon.ttf');
    exec('curl https://i.icomoon.io/public/daf89d25ac/WappaIcons/icomoon.woff > src/fonts/icomoon.woff');
    exec('curl https://i.icomoon.io/public/daf89d25ac/WappaIcons/icomoon.woff2 > src/fonts/icomoon.woff2');
    exec('curl https://i.icomoon.io/public/daf89d25ac/WappaIcons/style.css > src/css/icons.css', function(err){
        cb(err);

        var file = 'src/css/icons.css';
        var fs = require('fs');
        fs.readFile(file, 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }
            var result = data.replace('https://i.icomoon.io/public/daf89d25ac/WappaIcons/icomoon.eot', '../fonts/icomoon.eot');

            fs.writeFile(file, result, 'utf8', function (err) {
                if (err) return console.log(err);
            });
        });
    });
});

gulp.task('build', ['clean', 'icomoon-update'], function () {
    gulp.start('css', 'fonts', 'images');
});

//inserir o código abaixo nos gulpfile.js das aplicações 
gulp.task('wappa-uikit', function() {
    gulp.src('bower_components/wappa-uikit/dist/images/**/*.{ico,gif,jpg,jpeg,png,svg}')
        .pipe(gulp.dest('dist/images/'));

    gulp.src('bower_components/wappa-uikit/dist/fonts/**/*.{eot,svg,ttf,woff,woff2}')
        .pipe(gulp.dest( 'dist/fonts/' ));
});


