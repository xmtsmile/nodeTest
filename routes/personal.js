var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var config = require('../mysql/config');
var pool = mysql.createPool(config.mysql);

router.get('/personal', function(req, res, next) {
    res.render('personal');
    // pool.getConnection(function(err, connection){
    //    var sql = "select * from user_course";
    //    connection.query(sql, function (err, result) {
    //        if(result){
    //            res.render('personal');
    //        }
    //    })
    // });
});

module.exports = router;