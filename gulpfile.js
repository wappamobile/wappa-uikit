'use strict';

var gp = require('gulp');
var exec = require('child_process').exec;
var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'del', 'browser-sync']
});

gp.task('images', function () {
    return gp.src(
        ['src/images/**/*.{ico,gif,jpg,jpeg,png,svg}'])
        .pipe(gp.dest( 'dist/images' ));
});

gp.task('docs-images', function () {
    return gp.src(
        ['src/docs/images/**/*.{ico,gif,jpg,jpeg,png,svg}'])
        .pipe(gp.dest( 'docs/images' ));
});

gp.task('fonts', function () {
    return gp.src('src/fonts/**/*.{eot,svg,ttf,woff,woff2}')
        .pipe(gp.dest( 'dist/fonts' ));
});

gp.task('docs-fonts', function () {
    return gp.src('src/fonts/**/*.{eot,svg,ttf,woff,woff2}')
        .pipe(gp.dest( 'docs/fonts' ));
});

gp.task('css', function () {
    gp.src([
            'src/css/typography.css',
            'node_modules/bootstrap/dist/css/bootstrap.css',
            'src/css/**/*.css'
        ])
        .pipe($.concatCss('wappa-uikit.css'))
        .pipe(gp.dest('dist/css/'))
        .pipe($.concatCss('wappa-uikit.min.css'))
        .pipe($.stripCssComments({ all: true }))
        .pipe($.cssmin())
        .pipe(gp.dest('dist/css'));
});

gp.task('docs-css', function () {
    gp.src([
            'src/css/typography.css',
            'node_modules/bootstrap/dist/css/bootstrap.css',
            'src/css/**/*.css',
            'src/docs/css/*.css'
        ])
        .pipe($.concatCss('docs.min.css', {rebaseUrls:false}))
        .pipe($.stripCssComments({ all: true }))
        .pipe($.cssmin())
        .pipe(gp.dest('docs/css/'));
});

gp.task('docs-html', function () {
    return gp.src('src/docs/**/*.html')
        .pipe($.useref())
        .pipe($.htmlmin({collapseWhitespace: true}))
        .pipe(gp.dest( 'docs' ));
});

gp.task('browser-sync', function () {
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

gp.task('clean-docs', function(done) {
    $.del(['docs'], done);
});

gp.task('clean-dist', function(done) {
    $.del(['dist'], done);
});

gp.task('serve', ['browser-sync']);

gp.task('icomoon-update', function (cb) {
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

gp.task('git-update', function () {
    exec('git describe --abbrev=0 --tags', function(error, stdout){
        var tag = stdout.replace('\r\n','');
        var newTag = [ tag.split('.')[0], tag.split('.')[1], Number(tag.split('.')[2])+1].join('.');

        exec('git add .');
        exec('git commit -m "build"');
        exec('git tag ' + newTag);
        exec('git push origin HEAD --tags');
    });
});

gp.task('build', ['clean-dist', 'icomoon-update'], function () {
    gp.start('css', 'fonts', 'images', 'docs');
});

gp.task('docs', ['clean-docs'], function () {
    gp.start('docs-html', 'docs-fonts', 'docs-images', 'docs-css', 'git-update');
});

gp.task('deploy', [], function() {
    gp.start('build', function(){
        gp.start('git-update');
    });
});

//inserir o código abaixo nos gulpfile.js das aplicações 
gp.task('wappa-uikit', function() {
    gp.src('bower_components/wappa-uikit/dist/images/**/*.{ico,gif,jpg,jpeg,png,svg}')
        .pipe(gp.dest('dist/images/'));

    gp.src('bower_components/wappa-uikit/dist/fonts/**/*.{eot,svg,ttf,woff,woff2}')
        .pipe(gp.dest( 'dist/fonts/' ));
});
