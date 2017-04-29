var gulp = require('gulp');
var less = require('gulp-less');
var rename = require('gulp-rename');
var minify = require('gulp-minify-css');

gulp.task('default', function () {
gulp.src('./assets/theme.less')
    .pipe(less())
    .pipe(minify())   
    .pipe(rename({suffix: ".min"}))
    .pipe(gulp.dest('./app/public/css'));
});