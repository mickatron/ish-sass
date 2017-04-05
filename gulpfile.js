'use strict';
const gulp			= require('gulp');
const sassdoc 		= require('sassdoc');
const bump 			= require('gulp-bump');
const gutil 		= require('gulp-util');
const git 			= require('gulp-git');
const runSequence 	= require('run-sequence');
const fs 			= require('fs');

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

// $ gulp release --type (major || minor || patch)
gulp.task('release', function(callback) {
runSequence(
    //'merge-changes',
	//'default',
    'bump-version',
    'commit-changes',
    'push-changes',
    'create-new-tag',
    //'github-release',
    function (error) {
      if (error) {
        console.log(error.message);
      } else {
        console.log('RELEASE FINISHED SUCCESSFULLY');
      }
      callback(error);
    });
});

gulp.task('bump-version', function () {
	var type = gutil.env.type || "patch";
	console.log('Release patch type: ', type);
// We hardcode the version change type to 'patch' but it may be a good idea to
// use minimist (https://www.npmjs.com/package/minimist) to determine with a
// command argument whether you are doing a 'major', 'minor' or a 'patch' change.
  return gulp.src(['./package.json'])
    .pipe(bump({type: type}).on('error', gutil.log))
    .pipe(gulp.dest('./'));
});

gulp.task('commit-changes', function () {
  return gulp.src('.')
    //.pipe(git.add())
    .pipe(git.commit('[Prerelease] Bumped version number'));
});

gulp.task('push-changes', function (cb) {
  git.push('origin', 'master', cb);
});

gulp.task('create-new-tag', function (cb) {
  var version = getPackageJsonVersion();
  git.tag(version, 'Created Tag for version: ' + version, function (error) {
    if (error) {
      return cb(error);
    }
    git.push('origin', 'master', {args: '--tags'}, cb);
  });

  function getPackageJsonVersion () {
    // We parse the json file instead of using require because require caches
    // multiple calls so the version number won't be updated
    return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
  };
});

/*gulp.task('merge-changes', function () {
  return 
	.pipe(git.merge('staging', 
		function (err) { 
			if (err) throw err;
		})
	)
});*/