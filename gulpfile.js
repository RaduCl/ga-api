var gulp = require('gulp'),
    nodemon = require('gulp-nodemon');

gulp.task('default', function(){
    nodemon({
        script: './bin/www',
        //script: './app.js',
        ext: 'js',
        env: {
            PORT: 8007
        },
        ignore: ['./node_modules/**']
    })
        .on('restart', function(){
            console.log('Restarting...');
        });
});