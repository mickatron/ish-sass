'use strict';
const gulp			= require('gulp');
const sassdoc 		= require('sassdoc');

const _docFolder = './docs';
const _srcFiles = './src/**/*.scss';

gulp.task('sassdoc', function () {
  return gulp.src(_srcFiles)
    .pipe(
    	sassdoc({
		    dest: _docFolder,
		    verbose: true
		})
	);
});

gulp.task('clean', function() { return require('del')(_docFolder); });

// $ gulp watch
gulp.task('watch', function() {
  gulp.watch([_srcFiles], ['sassdoc']);
});

// $ gulp
// `gulp` - Run a complete build. 
gulp.task('default', ['clean'], function() {
  gulp.start('sassdoc');
});