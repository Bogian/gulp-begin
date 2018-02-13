var gulp = require('gulp');
var sass = require('gulp-sass');
var server = require('browser-sync').create();
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
        .pipe(server.reload({
            stream: true
        }))
});
gulp.task('watch', ['server'], function(){
    gulp.watch('src/scss/**/*.scss', ['sass','useref', server.reload]);
    gulp.watch('src/*.html', ['useref',server.reload]);
    gulp.watch('src/js/**/*.js', ['useref', server.reload]);
    gulp.watch('src/css/**/*.css', ['useref', server.reload]);
    gulp.watch('src/fonts/**/*.otf', ['fonts', server.reload]);
    gulp.watch('src/images/**/*.otf', ['images', server.reload]);
});
gulp.task('server', function() {
    server.init({
        server: {
            baseDir: 'dist'
        },
    })
})
