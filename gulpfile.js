var gulp = require('gulp');
var react = require('gulp-react');
var concat = require('gulp-concat');
var watch = require('gulp-watch');
var coffee = require('gulp-coffee');

gulp.task('default', function () {
  gulp.watch('assets/javascripts/components/*.jsx', function() {

    console.log("Compiling React components...")

    gulp.src('assets/javascripts/components/**')
      .pipe(concat('components.js'))
      .pipe(react())
      .pipe(gulp.dest('public/javascripts'));
  });

  gulp.watch(['assets/javascripts/models/**', 'assets/javascripts/application.coffee'], function() {

    console.log("Compiling models...")

    gulp.src(['assets/javascripts/models/**', 'assets/javascripts/application.coffee'])
      .pipe(concat('application.js'))
      .pipe(coffee({bare: true}).on('error', function(err) { console.log(error) }))
      .pipe(gulp.dest('public/javascripts'));
  });
});