/**
 * Created by Administrator on 2017/5/9.
 */
var url = require("url");
var datajson = require("./data/main.js");
const gulp = require('gulp'),
      rename = require('gulp-rename'),   //文件重命名
      uglify = require('gulp-uglify'),  //js的压缩
      concat = require('gulp-concat'),   //文件的合并
      sass = require('gulp-sass'),       //sass的编译
      cleanCSS = require('gulp-clean-css'),  //css的压缩
      browserify = require('gulp-browserify'), //模块化的打包
      webserver = require('gulp-webserver'),  //web服务热启动
      imagemin = require('gulp-imagemin'),    //图片的压缩
      rev = require('gulp-rev'),               //对文件名加MD5后缀
      revCollector = require('gulp-rev-collector'), //路径替换
      pngquant = require('imagemin-pngquant');   //图片的深度压缩

gulp.task('js', function () {
    gulp.src('src/js/common/*.js')
        //.pipe(concat("app.js"))
        //.pipe(rename({suffix: '.min'}))
        //.pipe(uglify())
        //.pipe(browserify({
        //    insertGlobals : true,
        //    debug : !gulp.env.production
        //}))
        .pipe(gulp.dest("./build/js/common")) //输出到文件夹
});


gulp.task("css",function(){
    gulp.src("src/css/*.scss")
        .pipe(sass())
        .pipe(cleanCSS())
        .pipe(rev())
        .pipe(gulp.dest("./build/css"))
        .pipe(rev.manifest())
        .pipe(gulp.dest("./rev/css"))
})

gulp.task("revhtml",function(){
    gulp.src(['rev/**/*.json', 'src/**/*.html'])
        .pipe(revCollector({
            replaceReved: true,
            dirReplacements: {
                '/css': '../css',
                'js': '../js/',
                //'cdn/': function(manifest_value) {
                //    return '//cdn' + (Math.floor(Math.random() * 9) + 1) + '.' + 'exsample.dot' + '/img/' + manifest_value;
                //}
            }
        }))
        .pipe(gulp.dest("build"))
})

gulp.task("testImagemin", function(){
    gulp.src("src/img/*.{png,jpg,gif,ico}")
        /*.pipe(imagemin({
            optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        }))*/
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],//不要移除svg的viewbox属性
            use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
        }))
        .pipe(gulp.dest("./dist/img"))
})

gulp.task("build",["js","css","revhtml"])

gulp.task("webserver",["build"], function(){
    //gulp.watch("./src/css/*.scss",["css"]);
    //gulp.watch("./src/html/*.html",["html"]);
    gulp.src('./build')
        .pipe(webserver({
            livereload: true,
            directoryListing: true,
            port:3300,
            open: "/html/search.html",
            middleware:function(req,res,next){
                var paths = url.parse(req.url).pathname,
                    data = datajson.getData();
                data.forEach(function(item){
                    if(item.route==paths){
                        item.handle(req,res,next)
                    }
                })
                next();
            }
        }));
})