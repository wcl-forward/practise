/**
 * Created by Administrator on 2017/5/10.
 */
var Mock = require("mockjs");
module.exports.getData = function(){
    return [
        {
            route:"/index",
            handle:function(req,res,next){
                res.writeHead(200,{
                    "Content-Type":"application/json;charset=utf-8",
                    "Access-Control-Allow-Origin":"*"
                })
                var data = {
                    url:"index.html",
                    name:"lucy",
                    id:1
                }
                res.write(JSON.stringify(data));
                res.end();
            }
        },
        {
            route:"/mock",
            handle:function(req,res,next){
                res.writeHead(200,{
                    "Content-Type":"application/json;charset=utf-8",
                    "Access-Control-Allow-Origin":"*"
                })
                var Random = Mock.Random;
                Random.integer();
                Random.string("lower",4);
                Random.date("yyyy-MM-dd");
                var data = Mock.mock({
                    "menuList|6":[{
                        "menuNav":"@string()",
                        "menuNavContent|1-5":[{
                            url:"index.html",
                            name:"@string('lower',4)",
                            id:"@integer(0,10)"
                        }]
                    }]
                })
                res.write(JSON.stringify(data));
                res.end();
            }
        }
    ]
}