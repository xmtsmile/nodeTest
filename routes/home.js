var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var config = require('../mysql/config');
var pool = mysql.createPool(config.mysql);

router.get('/', function(req, res, next) {
    var user = req.query.user;
    var menus = new Object();
    var publicClass = new Object();
    var data = new Array();
    var data1 = new Array();

    pool.getConnection(function(err,connection){
        var sql = "select * from course_type";
        connection.query(sql,function(err,result){
            for(var i = 0;i<result.length;i++){
                data.push(result[i]);
            }
            menus.data = data;
            res.locals.user = user;
            res.locals.menus = menus;

            var sql1 = "select * from course where type='公共复选课'";
            connection.query(sql1,function(err,result){
                for(var i = 0;i<result.length;i++){
                    data1.push(result[i]);
                }
                publicClass.data = data1;
                res.locals.publicClass = publicClass;
                connection.release();
                res.render('home');
            });
        });
    });
});

router.post('/select', function(req, res, next) {
    var data = new Array();
    var selectResult = new Object();
    var selectTag = req.body.selectTag;
    var username = req.body.username;
    pool.getConnection(function(err,connection){
        var sql = " insert into user_course(name, type, username) select name, type, ? as username from course where name=?";
        connection.query(sql, [username,selectTag], function(err,result){
            if(result.insertId){
                var sql1 = 'update course set available=available-1 where name=?;'
                connection.query(sql1, [selectTag], function(err,result){
                    console.log('result-', result);
                    if(result.changedRows){
                        jsonResult = {
                            code: 200,
                            msg: '选课成功！'
                        };
                        res.json(jsonResult);
                    }
                });
            }
        });
    });
});

module.exports = router;