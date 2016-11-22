'use strict';

var g = require('gulp');
var exec = require('child_process').exec;
var _ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'del', 'browser-sync', 'run-sequence']
});

g.task('images', function () {
    return g.src(
        ['src/images/**/*.{ico,gif,jpg,jpeg,png,svg}'])
        .pipe(g.dest( 'dist/images' ));
});

g.task('docs-images', function () {
    return g.src(
        ['src/docs/images/**/*.{ico,gif,jpg,jpeg,png,svg}'])
        .pipe(g.dest( 'docs/images' ));
});

g.task('fonts', function () {
    return g.src('src/fonts/**/*.{eot,svg,ttf,woff,woff2}')
        .pipe(g.dest( 'dist/fonts' ));
});

g.task('docs-fonts', function () {
    return g.src('src/fonts/**/*.{eot,svg,ttf,woff,woff2}')
        .pipe(g.dest( 'docs/fonts' ));
});

g.task('css', function () {
    g.src([
            'src/css/typography.css',
            'node_modules/bootstrap/dist/css/bootstrap.css',
            'src/css/**/*.css'
        ])
        .pipe(_.concatCss('wappa-uikit.css'))
        .pipe(g.dest('dist/css/'))
        .pipe(_.concatCss('wappa-uikit.min.css'))
        .pipe(_.stripCssComments({ all: true }))
        .pipe(_.cssmin())
        .pipe(g.dest('dist/css'));
});

g.task('docs-css', function () {
    g.src([
            'src/css/typography.css',
            'node_modules/bootstrap/dist/css/bootstrap.css',
            'src/css/**/*.css',
            'src/docs/css/*.css'
        ])
        .pipe(_.concatCss('docs.min.css', {rebaseUrls:false}))
        .pipe(_.stripCssComments({ all: true }))
        .pipe(_.cssmin())
        .pipe(g.dest('docs/css/'));
});

g.task('docs-html', function () {
    return g.src('src/docs/**/*.html')
        .pipe(_.useref())
        .pipe(_.htmlmin({collapseWhitespace: true}))
        .pipe(g.dest( 'docs' ));
});

g.task('browser-sync', function () {
    _.browserSync.instance = _.browserSync.init(
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

g.task('clean-docs', function(done) {
    _.del(['docs'], done);
});

g.task('clean-dist', function(done) {
    _.del(['dist'], done);
});

g.task('serve', ['browser-sync']);

g.task('icomoon-update', function (cb) {
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

g.task('git-update', function () {
    exec('git describe --abbrev=0 --tags', function(error, stdout){
        var tag = stdout.replace('\r\n','');
        var newTag = [ tag.split('.')[0], tag.split('.')[1], Number(tag.split('.')[2])+1].join('.');

        exec('git status -s', function(error, modified){
            if (!modified) return;

            exec('git add .;git commit -m "build";git tag ' + newTag + '; git push origin HEAD --tags');
        });

    });
});

g.task('build', ['clean-dist', 'icomoon-update'], function () {
    g.start('css', 'fonts', 'images', 'docs');
});

g.task('docs', ['clean-docs'], function () {
    g.start('docs-html', 'docs-fonts', 'docs-images', 'docs-css');
});

g.task('deploy', [], function () {
    var stream = 0
    g.start('build', function (){
        stream=1;
    });
    var threadGit = setInterval(function(){
        if(stream){
            g.start('git-update');
            clearInterval(threadGit);
        }
    });
});

//inserir o código abaixo nos gulpfile.js das aplicações 
g.task('wappa-uikit', function() {
    g.src('bower_components/wappa-uikit/dist/images/**/*.{ico,gif,jpg,jpeg,png,svg}')
        .pipe(g.dest('dist/images/'));

    g.src('bower_components/wappa-uikit/dist/fonts/**/*.{eot,svg,ttf,woff,woff2}')
        .pipe(g.dest( 'dist/fonts/' ));
});
