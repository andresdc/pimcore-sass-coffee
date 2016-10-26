/**
 * Created by andre on 12/10/2016.
 */
'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var $ = require('gulp-load-plugins')();
var gulpsync = $.sync(gulp);
var util = $.util;
var coffee = require('gulp-coffee');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");

var isProduction = false;

gulp.task('default', gulpsync.sync([
    'sass',
    'sass:watch',
    'coffee',
    'coffee:watch'
]));

gulp.task('sass', function () {
    log('Converting SASS files to CSS');
    return gulp.src('./pimcore/static/sass/**/*.sass')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./pimcore/static/css/custom'));
});

gulp.task('sass:watch', function () {
    gulp.watch('./pimcore/static/sass/**/*.sass', ['sass']);
});

gulp.task('coffee', function () {
    log('Converting Coffee files to JS ... ');
    gulp.src('./pimcore/static/coffee/**/*.coffee')
        .pipe(sourcemaps.init())
        .pipe(coffee({bare: true})).on('error', $.util.log)
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./pimcore/static/js/custom'));
});

gulp.task('coffee:watch', function () {
    gulp.watch('./pimcore/static/coffee/**/*.coffee', ['coffee']);
});

gulp.task('minify:js', function () {
    log('Generating Minified Javascripts ... ');
    // Minify and copy all JavaScript (except vendor scripts)
    return gulp.src(['./pimcore/static/js/custom/**/*.js'])
        .pipe($.jsvalidate())
        .on('error', handleError)
        .pipe($.uglify({preserveComments: 'some'}))
        .on('error', handleError)
        .pipe(rename({
            extname: ".min.js"
        }))
        .pipe(gulp.dest('./pimcore/static/js/custom-min'));
});

gulp.task('minify:css', function () {
    log('Generating Minified CSS ... ');
    return gulp.src(['./pimcore/static/css/custom/**/*.css'])
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename({
            extname: ".min.css"
        }))
        .pipe(gulp.dest('./pimcore/static/css/custom-min'));
});

// Error handler
function handleError(err) {
    log(err.toString());
    this.emit('end');
}

// log to console using
function log(msg) {
    $.util.log($.util.colors.blue(msg));
}