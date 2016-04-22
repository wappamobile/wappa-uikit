var gulp        = require('gulp');
var browserSync = require('browser-sync').create();

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