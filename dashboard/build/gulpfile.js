'use strict';
var host = '';
var user = '';
var pass = '';
var path = '';

var gulp =      require('gulp'),
    gutil =     require('gulp-util'),
    minicss =  require('gulp-minify-css'),
    concat =    require('gulp-concat'),
    jade =      require('gulp-jade'),
    sass =      require('gulp-sass'),
    minihtml =  require('gulp-minify-html'),
    gmin =      require('gulp-imagemin'),
    ftp =       require('gulp-ftp'),
    uglify =    require('gulp-uglify'),
    watch =     require('gulp-watch'),
    connect =   require('gulp-connect');

//I want to:

//Compile Jade
gulp.task('html', function(){
    return gulp.src('markup/**/*.jade')
        .pipe(jade({
            pretty: true
        }))
        //.pipe(minihtml())
        .pipe(gulp.dest('../deploy/'))
        .pipe(connect.reload());
});
//Compiles Sass
gulp.task('styles', function(){
    return gulp.src('styles/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(minicss({compatability: 'ie8'}))
        .pipe(gulp.dest('../deploy/styles/'))
        .pipe(connect.reload());
});
//Compiles scripts
gulp.task('scripts', function(){
    return gulp.src('scripts/**/*.js')
        //.pipe(uglify())
        .pipe(gulp.dest('../deploy/scripts/'))
        .pipe(connect.reload());
});
//transform images
gulp.task('images', function(){
    return gulp.src('images/**/*')
        .pipe(gmin())
        .pipe(gulp.dest('../deploy/images/'))
        .pipe(connect.reload());
});

gulp.task('server', function() {
    return connect.server({
        port: 8181,
        livereload: true,
        root: '../deploy'
    });
});

gulp.task('build', function(){
    gulp.run('html');
    gulp.run('styles');
    gulp.run('scripts');
    gulp.run('images');
});

//Minify Images
gulp.task('default', ['server'], function(){
    gulp.watch('markup/*.jade', ['html']);
    gulp.watch('styles/*.scss', ['styles']);
    gulp.watch('scripts/*.js', ['scripts']);
    gulp.watch('images/**/*', ['images']);
});

gulp.task('deploy', function(){
    return gulp.src('../deploy/**/*')
        .pipe(ftp({
            host: host,
            user: user,
            pass: pass,
            remotePath: path
        }))
        .pipe(gutil.noop());
});


