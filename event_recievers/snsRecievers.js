/**
 * Created by pariskshitdutt on 03/04/17.
 */
var config= require('config');
var events = require('../events');
var log = require('tracer').colorConsole(config.get('log'));
var mysql =require("mysql");
var pool = mysql.createPool(config.get("mysql"));
events.emitter.on('bounce',function(data){
    log.info(data);
    try{
        pool.getConnection(function(err, connection) {
            if (err) {
                def.reject();
            } else {
                var sql = "update users set bounce='true',bounce_time=" + connection.escape(new Date()) + " where " +
                    "email=" + connection.escape(data.destination[0])
                log.debug(sql)
                connection.query(sql, function (err, results, fields) {
                    connection.release();
                })
            }
        });
    }catch(e){
        log.info(e);
    }
});
events.emitter.on('complaint',function(data){
    log.info(data);
    try{
        pool.getConnection(function(err, connection) {
            if (err) {
                def.reject();
            } else {
                var sql = "update users set complaint='true',complaint_time=" + connection.escape(new Date()) + " where " +
                    "email=" + connection.escape(data.destination[0])
                log.debug(sql)
                connection.query(sql, function (err, results, fields) {
                    connection.release();
                })
            }
        });
    }catch(e){
        log.info(e);
    }
});