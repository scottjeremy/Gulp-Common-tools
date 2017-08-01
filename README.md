# Gulp自动化常用构建工具

抛开Grunt，又有一个新的自动化构建系统成为新的领跑者。那就是Gulp。

在这里列举我经常使用的Gulp自动化常用构建工具，方便以后构建工程时所需。一直在追赶，从未敢怠慢！

## 阅读下文前，我建议先阅读我以下两篇文章：

### gulp是基于NodeJS和NPM，具体安装教程在[这里](http://www.cnblogs.com/scottjeremy/p/6993480.html)

### 我怎么使用Gulp？一篇文章学会Gulp：[Getting started with Gulp（中文）](http://www.cnblogs.com/scottjeremy/p/7264056.html)

## 具体功能：
* 默认任务（Hello World！）
* 编译Sass
* 压缩CSS
* 编译和压缩Sass
* JavaScript代码规范
* JavaScript合并
* 压缩JavaScript
* 代码规范+合并+压缩JavaScript
* 压缩图片
* 监测任务
* 压缩HTML

## gulpfile.js:
```javascript
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
```
## 项目任务命令

```
默认任务（Hello World！）         $ gulp
编译Sass                          $ gulp ruby-sass
压缩CSS                           $ gulp cssnano
编译和压缩Sass                    $ gulp styles
JavaScript代码规范                $ gulp jshint
JavaScript合并                    $ gulp js-concat
压缩JavaScript                    $ gulp js-uglify
代码规范+合并+压缩JavaScript      $ gulp scripts
压缩图片                          $ gulp images
监测任务                          $ gulp watch
压缩HTML                          $ gulp htmlmin
```

## 对你有帮助？点个star！