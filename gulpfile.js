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

gulp.task('default', gulpsync.sync([
    'sass',
    'sass:watch',
    'coffee',
    'coffee:watch'
]));

gulp.task('sass', function () {
    return gulp.src('./pimcore/static/sass/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./pimcore/static/css'));
});

gulp.task('sass:watch', function () {
    gulp.watch('./pimcore/static/sass/**/*.scss', ['sass']);
});

gulp.task('coffee', function () {
    gulp.src('./pimcore/static/coffee/**/*.coffee')
        .pipe(sourcemaps.init())
        .pipe(coffee({bare: true})).on('error', $.util.log)
        .pipe(sourcemaps.write('./pimcore/static/coffee/maps'))
        .pipe(gulp.dest('./pimcore/static/js'));
});

gulp.task('coffee:watch', function () {
    gulp.watch('./pimcore/static/coffee/**/*.coffee', ['coffee']);
});