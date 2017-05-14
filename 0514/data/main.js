/**
 * Created by Administrator on 2017/5/14.
 */
var Mock = require("mockjs");
module.exports.getData = function(){
    return [
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
                            'price|1000-10000':10000,
                            name:"@string('lower',4)",
                            'id|+1': 1
                    }]
                })
                res.write(JSON.stringify(data));
                res.end();
            }
        }
    ]
}