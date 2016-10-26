/**
 * Created by andre on 12/10/2016.
 */
'use strict';

/* --------------------- IMPORTS ------------------------------*/

var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var $ = require('gulp-load-plugins')();
var gulpsync = $.sync(gulp);
var util = $.util;
var coffee = require('gulp-coffee');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var fs = require('fs');
const mocha = require('gulp-mocha');

/* --------------------- CONFIGURATION ------------------------------*/

var isProduction = false;
var isTesting = false;

var paths = {
    dev: {
        sass: './pimcore/static/sass/**/*.sass',
        coffee: './pimcore/static/coffee/**/*.coffee',
        css: './pimcore/static/css/custom',
        js: './pimcore/static/js/custom',
        css_min: './pimcore/static/css/custom-min',
        js_min: './pimcore/static/js/custom-min'

    },
    test:{
        sass: './tests/sass/**/*.sass',
        coffee: './tests/coffee/**/*.coffee',
        css: './tests/css/result/dist',
        js: './tests/js/result/dist',
        css_min: './tests/css/result/min',
        js_min: './tests/js/result/min'
    }
};

/* --------------------- PRIMARY TASKS ------------------------------*/

gulp.task('default', gulpsync.sync([
    'sass',
    'sass:watch',
    'coffee',
    'coffee:watch'
]));

gulp.task('build', gulpsync.sync([
    'sass',
    'coffee',
    'minify:css',
    'minify:js'
]));

gulp.task('test', gulpsync.sync([
    'test:config',
    'minify:css',
    'minify:js',
    'mocha:tests'
]));

/* --------------------- SUBTASKS ------------------------------*/

gulp.task('sass', function () {
    log('Converting SASS files to CSS');
    var currentPath = isTesting ? paths.test:paths.dev;
    return gulp.src(currentPath.sass)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(currentPath.css));
});

gulp.task('sass:watch', function () {
    var currentPath = isTesting ? paths.test:paths.dev;
    gulp.watch(currentPath.sass, ['sass']);
});

gulp.task('coffee', function () {
    log('Converting Coffee files to JS ... ');
    var currentPath = isTesting ? paths.test:paths.dev;
    return gulp.src(currentPath.coffee)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(coffee({bare: true}))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(currentPath.js));
});

gulp.task('coffee:watch', function () {
    var currentPath = isTesting ? paths.test:paths.dev;
    gulp.watch(currentPath.coffee, ['coffee']);
});

gulp.task('minify:js', ['coffee'], function () {
    log('Generating Minified Javascripts ... ');
    var currentPath = isTesting ? paths.test:paths.dev;
    return gulp.src([currentPath.js+'/**/*.js'])
        .pipe(plumber())
        .pipe($.jsvalidate())
        .pipe($.uglify({preserveComments: 'some'}))
        .pipe(rename({
            extname: ".min.js"
        }))
        .pipe(gulp.dest(currentPath.js_min));
});

gulp.task('minify:css', ['sass'], function () {
    log('Generating Minified CSS ... ');
    var currentPath = isTesting ? paths.test:paths.dev;
    return gulp.src([currentPath.css+'/**/*.css'])
        .pipe(plumber())
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename({
            extname: ".min.css"
        }))
        .pipe(gulp.dest(currentPath.css_min));
});

gulp.task('test:config', function () {
    log('Seting up Testing environment ...');
    isTesting = true;
    clearFolders('./tests/css/result');
    clearFolders('./tests/js/result');
});

gulp.task('mocha:tests', function () {
    log('Running Mocha tests ...');
    return gulp.src('./tests/src/sass-js-plugin-test.js', {read: false})
    // gulp-mocha needs filepaths so you can't have any plugins before it
        .pipe(mocha())
});

/* --------------------- HELPERS ------------------------------*/

// Error handler
function handleError(err) {
    log(err.toString());
    this.emit('end');
}

// log to console using
function log(msg) {
    $.util.log($.util.colors.blue(msg));
}

function clearFolders(dirPath){
    try { var files = fs.readdirSync(dirPath); }
    catch(e) { return; }
    if (files.length > 0)
        for (var i = 0; i < files.length; i++) {
            var filePath = dirPath + '/' + files[i];
            if (fs.statSync(filePath).isFile())
                fs.unlinkSync(filePath);
            else
                clearFolders(filePath);
        }
    fs.rmdirSync(dirPath);
}