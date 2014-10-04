var gulp = require('gulp'),
    runSequence = require('run-sequence'),
    browserSync = require('browser-sync'),
    clean = require('gulp-rimraf'),
    sass = require('gulp-sass'),
    colorguard = require('gulp-colorguard'),
    jade = require('gulp-jade');




var SRC = {
    JADE: 'src/**/*.jade',
    JS: 'src/**/*.js',
    SASS: 'src/scss/**/*.scss',
    IMG: 'src/img/**/*.*'
};

gulp.task('build-jade', function () {
    var LOCALS = {};

    return gulp.src(SRC.JADE)
        .pipe(jade({ locals: LOCALS }))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.reload({ stream:true }));
});

gulp.task('build-sass', function () {
    return gulp.src(SRC.SASS)
        .pipe(sass({ sourceComments: 'map' }))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.reload({ stream:true }));
});

gulp.task('build-js', function () {
    return gulp.src(SRC.JS)
        .pipe(gulp.dest('dist'));
});

gulp.task('build-img', function () {
    return gulp.src(SRC.IMG)
        .pipe(gulp.dest('dist/img'))
        .pipe(browserSync.reload({ stream:true }));
});

gulp.task('browser-sync', function () {
    var files = [
        '*.html',
        'dist/css/**/*.css',
        'dist/**/*.js'
    ];

    browserSync.init(files, {
        server: {
             baseDir: 'dist'
        }
    });
});

gulp.task('watch', ['browser-sync', 'build'], function () {
    gulp.watch(SRC.JADE, ['build-jade']);
    gulp.watch(SRC.SASS, ['build-sass']);
    gulp.watch(SRC.JS, ['build-js']);
    gulp.watch(SRC.IMG, ['build-img']);
});



gulp.task('clean', function () {
    return gulp.src('dist/**/*', {read: false})
        .pipe(clean());
});

gulp.task('pre-build', function () {
    return gulp.src('src/CNAME')
        .pipe(gulp.dest('dist'));
});

gulp.task('build', function (callback) {
    runSequence('clean', 'pre-build', ['build-sass', 'build-jade', 'build-js', 'build-img'], callback);
});

gulp.task('default', ['build']);


var deploy = require("gulp-gh-pages-ci-compatible");
var options = {
    message: 'Update ' + new Date().toISOString() + ' [skip ci]',
    branch: "master"
};
gulp.task('deploy', ['build'], function () {
    gulp.src("dist/**/*")
        .pipe(deploy(options));
});
