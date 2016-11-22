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

gulp.task('docs-images', function () {
    return gulp.src(
        ['src/docs/images/**/*.{ico,gif,jpg,jpeg,png,svg}'])
        .pipe(gulp.dest( 'docs/images' ));
});

gulp.task('fonts', function () {
    return gulp.src('src/fonts/**/*.{eot,svg,ttf,woff,woff2}')
        .pipe(gulp.dest( 'dist/fonts' ));
});

gulp.task('docs-fonts', function () {
    return gulp.src('src/fonts/**/*.{eot,svg,ttf,woff,woff2}')
        .pipe(gulp.dest( 'docs/fonts' ));
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
        .pipe($.stripCssComments({ all: true }))
        .pipe($.cssmin())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('docs-css', function () {
    gulp.src([
            'src/css/typography.css',
            'node_modules/bootstrap/dist/css/bootstrap.css',
            'src/css/**/*.css',
            'src/docs/css/*.css'
        ])
        .pipe($.concatCss('docs.min.css', {rebaseUrls:false}))
        .pipe($.stripCssComments({ all: true }))
        .pipe($.cssmin())
        .pipe(gulp.dest('docs/css/'));
});

gulp.task('docs-html', function () {
    return gulp.src('src/docs/**/*.html')
        .pipe($.useref())
        .pipe($.htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest( 'docs' ));
});

gulp.task('browser-sync', function () {
    $.browserSync.instance = $.browserSync.init(
        [
            'docs/**/*.html',
            'docs/css/**/*.css',
            'docs/images/**/*.{ico,gif,jpg,jpeg,png,svg}',
            'src/css/**/*.css'
        ], {
            startPath: 'src/docs/index.html',
            server: {
                baseDir: './'
            },
            host: '0.0.0.0'
        }
    );
});

gulp.task('clean-docs', function(done) {
    $.del(['docs'], done);
});

gulp.task('clean-dist', function(done) {
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

gulp.task('git-update', function () {
    exec('git describe --abbrev=0 --tags', function(error, stdout){
        var tag = stdout.replace('\r\n','');
        var newTag = [ tag.split('.')[0], tag.split('.')[1], Number(tag.split('.')[2])+1].join('.');

        exec('git add .');
        exec('git commit -m "build"');
        exec('git tag ' + newTag);
        exec('git push origin HEAD --tags');
    });
});

gulp.task('build', ['clean-dist', 'icomoon-update'], function () {
    gulp.start('css', 'fonts', 'images', 'docs');
});

gulp.task('docs', ['clean-docs'], function () {
    gulp.start('docs-html', 'docs-fonts', 'docs-images', 'docs-css', 'git-update');
});

gulp.task('deploy', ['build'], function() {
    gulp.start('git-update');
});

//inserir o código abaixo nos gulpfile.js das aplicações 
gulp.task('wappa-uikit', function() {
    gulp.src('bower_components/wappa-uikit/dist/images/**/*.{ico,gif,jpg,jpeg,png,svg}')
        .pipe(gulp.dest('dist/images/'));

    gulp.src('bower_components/wappa-uikit/dist/fonts/**/*.{eot,svg,ttf,woff,woff2}')
        .pipe(gulp.dest( 'dist/fonts/' ));
});
