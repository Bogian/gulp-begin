var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-Sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
gulp.task('build', ['clean:dist','cache:clear', 'sass', 'useref', 'images', 'fonts'], function (){
    console.log('Building files');
})
gulp.task('clean:dist', function() {
    return del.sync('dist');
})
gulp.task('cache:clear', function (callback) {
    return cache.clearAll(callback)
})
gulp.task('fonts', function() {
    return gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'))
})
gulp.task('images', function(){
    return gulp.src('src/images/**/*.+(png|jpg|jpeg|gif|svg)')
    // Caching images that ran through imagemin
        .pipe(cache(imagemin({
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
});
gulp.task('useref', function(){
    return gulp.src('src/*.html')
        .pipe(useref())
        // Minifies only if it's a JavaScript file
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('dist'))
});
gulp.task('sass', function(){
    return gulp.src('src/scss/*.scss')
        .pipe(sass()) // Converts Sass to CSS with gulp-sass
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});
gulp.task('watch', ['browserSync'], function(){
    gulp.watch('src/scss/**/*.scss', ['sass','useref', browserSync.reload]);
    gulp.watch('src/*.html', ['useref',browserSync.reload]);
    gulp.watch('src/js/**/*.js', ['useref', browserSync.reload]);
    gulp.watch('src/css/**/*.css', ['useref', browserSync.reload]);
    gulp.watch('src/fonts/**/*.otf', ['fonts', browserSync.reload]);
    gulp.watch('src/images/**/*.otf', ['images', browserSync.reload]);
});
gulp.task('browserSync', function() {
    browserSync.init({
      server: {
        baseDir: 'dist'
      },
    })
  })
