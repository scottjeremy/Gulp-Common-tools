/*
        Gulp配置文件
* */
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),   //Sass编译
    cssnano = require('gulp-cssnano'),  //css压缩
    autoprefixer = require('gulp-autoprefixer'); //自动修复程序
    jshint = require('gulp-jshint'),    //JS代码规范
    uglify = require('gulp-uglify'),    //文件压缩
    imagemin = require('gulp-imagemin'),  //图片压缩
    rename = require('gulp-rename'),  //重命名
    htmlmin   = require('gulp-htmlmin'), // 压缩html
    concat = require('gulp-concat'),    //合并
    notify = require('gulp-notify'),    //监测文件变化
    livereload = require('gulp-livereload'),    //实时刷新（需游览器插件支持）
    del = require('del');   //清理文件

//默认任务
gulp.task('default', function() {
    console.log('Hello Gulp!');
});

//编译Sass
gulp.task('ruby-sass', function() {
    return sass('src/styles/main.scss', { style: 'expanded' })
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(notify({ message: '编译Sass完成' }));
});

//压缩CSS
gulp.task('cssnano', function() {
    return sass('src/styles/style.css', { style: 'expanded' })
        .pipe(autoprefixer('last 2 version'))
        .pipe(rename({suffix: '.min'}))
        .pipe(cssnano())
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(notify({ message: '压缩CSS完成' }));
});

//编译和压缩Sass
gulp.task('styles', function() {
    return sass('src/styles/main.scss', { style: 'expanded' })
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(cssnano())
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(notify({ message: '编译和压缩Sass完成' }));
});

//JavaScript代码规范
gulp.task('jshint', function() {
    return gulp.src('src/scripts/**/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(notify({ message: 'JS代码规范完成' }));
});

//JavaScript合并
gulp.task('js-concat', function() {
    return gulp.src(['src/scripts/1.js','src/scripts/2.js'])
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/assets/js'))
        .pipe(notify({ message: '合并JavaScript完成' }));
});

//压缩JavaScript
gulp.task('js-uglify', function() {
    return gulp.src('src/scripts/main.js')
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('dist/assets/js'))
        .pipe(notify({ message: '压缩JavaScript完成' }));
});

//代码规范+合并+压缩JavaScript
gulp.task('scripts', function() {
    return gulp.src('src/scripts/**/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/assets/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('dist/assets/js'))
        .pipe(notify({ message: 'Scripts任务完成' }));
});

//压缩图片
gulp.task('images', function() {
    return gulp.src('src/images/**/*')
        .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
        .pipe(gulp.dest('dist/assets/img'))
        .pipe(notify({ message: 'Images任务完成' }));
});

//监测任务
gulp.task('watch', function() {

    // Watch .scss files
    gulp.watch('src/styles/**/*.scss', ['styles']);

    // Watch .js files
    gulp.watch('src/scripts/**/*.js', ['scripts']);

    // Watch image files
    gulp.watch('src/images/**/*', ['images']);

});

//压缩HTML
gulp.task('htmlmin', function() {
    var optionsSet = {
        removeComments: true, // 清除HTML注释
        collapseWhitespace: true, // 压缩HTML
        collapseBooleanAttributes: true, // 省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: false, // 删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: false, // 删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: false, // 删除<style>和<link>的type="text/css"
        minifyJS: true, // 压缩页面JS
        minifyCSS: true // 压缩页面CSS
    };

    return gulp
        .src([config.dev.html, '!*.tpl'], { base: config.rootDev })
        .pipe(plumber(onError))
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulpif(options.env === 'production', htmlmin(optionsSet)))
        .pipe(gulp.dest(config.build.html))
        .pipe(reload({ stream: true }));
});


