/**
 * Created by Administrator on 2017/5/9.
 */
var url = require("url");
var datajson = require("./data/router.js");
const gulp = require('gulp'),
      webserver = require('gulp-webserver');  //web服务热启动


gulp.task("html",function(){
    gulp.src( 'src/**/*.html')
        .pipe(gulp.dest("build"))
})

gulp.task("webserver",["html"], function(){
    gulp.src('./build')
        .pipe(webserver({
            livereload: true,
            directoryListing: true,
            port:9000,
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