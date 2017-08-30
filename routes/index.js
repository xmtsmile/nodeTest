var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var config = require('../mysql/config');
var pool = mysql.createPool(config.mysql);

/* GET home page. */
router.get('/',function(req, res, next){
    res.redirect('/index');
});
/* GET home page. 这是登录和注册的情况*/
router.get('/index', function(req, res, next) {
    res.render('index');
});
//登录接口
router.post('/index/login', function (req, res, next) {
    var username = req.body.username;//获取前台请求的参数
    var password = req.body.password;
    console.log("getData:"+username + "," +password);
    pool.getConnection(function (err, connection) {
        //先判断该账号是否存在
        var $sql = "select * from users where username =?";
        connection.query($sql, [username], function (err, result) {
            if(err){
                console.log("err", err)
            } else {
                if (result.length === 0) {
                    result = {
                        code: "0",
                        msg: '该账号不存在'
                    };
                    res.json(result); // 以json形式，把操作结果返回给前台页面
                    connection.release();// 释放连接
                } else {
                    var $sql1 = "select * from users where username=? and password=?";
                    connection.query($sql1, [username, password], function (err, result) {
                        if(err){
                            console.log('err', err);
                        } else {
                            result = {
                                code: "200",
                                msg: '/home',
                                user:result[0].username
                            };
                            res.json(result); // 以json形式，把操作结果返回给前台页面
                        }
                    })
                }
            }
        });
    });
});

//注册接口
router.post('/index/register', function (req, res, next) {
    var username = req.body.username;//获取前台请求的参数
    var password = req.body.password;
    var nickName = req.body.nickName;
    //检查用户名是否已经注册
    pool.getConnection(function(err,connection){
        var serch_username = "select * from users where username=?";
        connection.query(serch_username,[username],function(err,result){
            if(err){
               console.log('err',err);
            } else{
                if(result.length>0){
                    result = {
                        code: "0",
                        msg: '该账号已经被注册!'
                    };
                    res.json(result); // 以json形式，把操作结果返回给前台页面
                    connection.release();// 释放连接
                }else{//账号还未被注册
                    pool.getConnection(function(err,connection){
                        var sql = "insert into users (username,password,realname) value(?,?,?)";
                        connection.query(sql,[username,password,nickName],function(err,result){
                            if(err){
                              console.log('err', err);
                            }else{
                                //插入成功
                                if(result){
                                    jsonResult = {
                                        code: "1",
                                        msg: '注册成功'
                                    };
                                    res.json(jsonResult);

                                }else{
                                    jsonResult = {
                                        code: "2",
                                        msg: '注册失败'
                                    };
                                    res.json(jsonResult);
                                }
                            }
                        });
                    });
                }
            }
        });
    });
});

module.exports = router;
