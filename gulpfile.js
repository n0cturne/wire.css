'use strict';

//
// Plugins
//
var gulp              = require('gulp');
var gulpLoadPlugins   = require('gulp-load-plugins');
var plugins           = gulpLoadPlugins();
var pkg               = require('./package.json');
require('gulp-release-tasks')(gulp);

//
// Paths
//
var path = {
    build     : './',
    css       : './css',
    js        : './js',
    dist      : './dist'
};

var source = {
    scss    : ['src/scss/**/*.scss' ],
    js      : [ 'src/js/*.js' ]
};

//
// Header
//
var header = ['/**',
  ' * <%= pkg.name %>',
  ' * @version    <%= pkg.version %>',
  ' * @homepage   <%= pkg.homepage %>',
  ' * @author     <%= pkg.author %>',
  ' * @license    Licensed under <%= pkg.license %>',
  ' */',
  ''].join('\n');

//
// Tasks
//
gulp.task('sass', function() {
  gulp.src(source.scss)
      .pipe(plugins.sass())
      .on('error', function (err) { console.log(err.message); })
      .pipe(gulp.dest(path.dist))
      .pipe(plugins.autoprefixer(
        { browsers: ['IE 8', 'IE 9', 'Firefox 14', 'last 5 versions',
        'Opera 11.1', 'Android 2.2'] }))
      .pipe(gulp.dest(path.dist))
      .pipe(plugins.notify({ message: pkg.name + ' compiled successful. Happy Code!' , onLast: true}));
});

gulp.task('distSass', function() {
  gulp.src(path.dist + '/wire.css')
      .pipe(plugins.mergeMediaQueries())
      .pipe(plugins.minifyCss())
      .pipe(plugins.header(header, {pkg: pkg}))
      .pipe(plugins.rename('wire.min.css'))
      .pipe(gulp.dest(path.dist))
      .pipe(plugins.notify({ message: pkg.name + ' CSS minified successful. Happy Code!' , onLast: true}));
});

gulp.task('distJs', function() {
  gulp.src(source.js)
      .pipe(gulp.dest(path.dist))
      .pipe(plugins.uglify())
      .on('error', function (err) { console.log(err.message); })
      .pipe(plugins.header(header, {pkg: pkg}))
      .pipe(plugins.rename('wire.min.js'))
      .pipe(gulp.dest(path.dist))
      .pipe(plugins.notify({ message: pkg.name + ' JS minified successful. Happy Code!' , onLast: true}));
});

gulp.task('default', function() {
  gulp.watch(source.scss, ['sass']);
});

gulp.task('build', ['distSass', 'distJs']);

gulp.task('dev', function() {
  gulp.watch(source.scss, ['sass', 'distSass']);
  gulp.watch(source.js, ['distJs']);
});
