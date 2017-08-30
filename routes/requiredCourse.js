var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var config = require('../mysql/config');
var pool = mysql.createPool(config.mysql);

router.get('/Quality', function(req, res, next) {
    var user = req.query.user;
    var menus = new Object();
    var qualityClass = new Object();
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

            var sql1 = "select * from course where type='素质拓展课'";
            connection.query(sql1,function(err,result){
                for(var i = 0;i<result.length;i++){
                    data1.push(result[i]);
                }
                qualityClass.data = data1;
                res.locals.qualityClass = qualityClass;
                connection.release();
                res.render('requiredCourse');
            });
        });
    });
});

module.exports = router;