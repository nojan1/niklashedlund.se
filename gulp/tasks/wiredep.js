'use strict';

var gulp = require('gulp-help')(require('gulp'));
var wiredep = require('wiredep').stream;
var plumber = require('gulp-plumber');

var config = require('./../config.js');
var handleError = require('./../utils/handleError.js');

// Inject bower components to sass
gulp.task('wiredep:sass', 'Inject Bower dependencies to Sass', function() {
  return gulp.src(config.wiredep.sass.src)
    .pipe(plumber(handleError))
    .pipe(wiredep(config.wiredep.sass.cfg))
    .pipe(gulp.dest(config.wiredep.sass.dest));
});

// Inject bower components to nunjucks
gulp.task('wiredep:nunjucks', 'Inject Bower dependencies to nunjucks', function() {
  return gulp.src(config.wiredep.nunjucks.src)
    .pipe(plumber(handleError))
    .pipe(wiredep(config.wiredep.nunjucks.cfg))
    .pipe(gulp.dest(config.wiredep.nunjucks.dest));
});

// Inject bower components
gulp.task('wiredep', 'Inject Bower dependencies', ['wiredep:sass','wiredep:nunjucks']);