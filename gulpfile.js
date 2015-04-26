var gulp = require('gulp');
var react = require('gulp-react');
var concat = require('gulp-concat');
var watch = require('gulp-watch');

gulp.task('default', function () {
  gulp.watch('assets/js/components/*.jsx', function() {

    console.log("Compiling React components...")

    gulp.src('assets/js/components/**')
      .pipe(concat('components.js'))
      .pipe(react())
      .pipe(gulp.dest('public/javascripts'));
  });
});