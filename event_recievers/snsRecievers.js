/**
 * Created by pariskshitdutt on 03/04/17.
 */
var config= require('config');
var events = require('../events');
var log = require('tracer').colorConsole(config.get('log'));
var mysql =require("mysql");
var connection = mysql.createConnection(config.get("mysql"));
connection.connect();
events.emitter.on('bounce',function(data){
    try{
        var sql="update email_campaigns set bounce='true',bounce_time="+connection.escape(new Date())+" where " +
            "email="+connection.escape(data.destination[0])+
        log.debug(sql)
        connection.query(sql,function(err,results,fields){
        })
    }catch(e){
        console.log(e);
    }
});
events.emitter.on('complaint',function(data){
    try{
        var sql="update email_campaigns set complaint='true',complaintc_time="+connection.escape(new Date())+" where " +
            "email="+connection.escape(data.destination[0])+
            log.debug(sql)
        connection.query(sql,function(err,results,fields){
        })
    }catch(e){
        console.log(e);
    }
});