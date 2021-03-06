/**
 * Created by pariskshitdutt on 08/03/16.
 */
var q= require('q');
var config= require('config');
var jwt = require('jwt-simple');
var ObjectId = require('mongoose').Types.ObjectId;
var moment= require('moment');
// var multer=require('multer')
var async= require('async');
var events = require('../events');
var log = require('tracer').colorConsole(config.get('log'));
var apn=require('../notificationSenders/apnsender');
var gcm=require('../notificationSenders/gcmsender');
var crypto=require('../authentication/crypto');
var base64 = require('base-64');
var bcrypt = require('bcrypt');
var mysql =require("mysql");
var pool = mysql.createPool(config.get("mysql"));

var runs={
    updateTracker:function(req){
        var def=q.defer();
        try{
            log.info(req.params);
            pool.getConnection(function(err, connection) {
                if(err){
                    def.reject();
                }else{
                    var input=JSON.parse(base64.decode(req.params.pixel_name.replace(".jpg","")))
                    var sql="update email_campaigns set status=1,open_time="+connection.escape(new Date())+" where " +
                        "email="+connection.escape(input.email)+"and campaign_id="+connection.escape(input.campaign_id);
                    connection.query(sql,function(err,results,fields){
                        // connection.end();
                        connection.release();
                    })
                }
            })
        }catch(e){
            log.info(e);
        }
        def.resolve();
        return def.promise;
    },
    addEmail:function(req){
        var def=q.defer();
        try{
            events.emitter.emit('process_csv',req.file.filename);
            // var input=
            // connection.connect();
            // connection.query("update "+input.table+" set "+input.field+"=1 where email="+input.email+" and campaign_id="+input.campaign_id,function(err,results,fields){
            //
            // })
        }catch(e){
            console.log(e);
        }
        def.resolve();
        return def.promise;
    },
    insertEmail:function(req){
        var def=q.defer();
        try{
            console.log(req.body);
            pool.getConnection(function(err, connection) {
                    if(err){
                        def.reject();
                    }else {
                        var sql = 'insert into email_campaigns(email,campaign_id,send_time)' +
                            ' values(' + connection.escape(req.body.email.replace(/"/g, "")) + ',' + connection.escape(req.body.campaign_id.replace(/"/g, "")) +
                            "," + connection.escape(new Date()) + ')'
                        connection.query(sql, function (err, results, fields) {
                            // connection.end();
                            connection.release();
                        })
                        var sql2 = 'insert into users(email)' +
                            ' values(' + connection.escape(req.body.email.replace(/"/g, "")) + ')'
                        connection.query(sql2, function (err, results, fields) {
                            // connection.end();
                            connection.release();
                        })
                    }
            });
        }catch(e){
            console.log(e);
        }

        def.resolve();
        return def.promise;
    },
    updateClicks:function(req){
        var def=q.defer();
        // try{
            log.info(req.params);
        //     var sql="update email_campaigns set clicks= clicks + 1,click_time="+connection.escape(new Date())+" where " +
        //         "email="+connection.escape(req.query.email)+"and campaign_id="+connection.escape(req.query.campaign_id);
        //     connection.query(sql,function(err,results,fields){
        //         // connection.end();
                def.resolve();
        //     })
        // }catch(e){
        //     console.log(e);
        // }
        return def.promise;
    },
    unsubscribe:function (req) {
        var def=q.defer();
        try{
            pool.getConnection(function(err, connection) {
                if (err) {
                    def.reject();
                } else {
                    var data = JSON.parse(base64.decode(req.query.data))
                    var sql = "update users set unsub='true',unsub_campaign=" + connection.escape(data.campaign_id) + ",unsub_time=" + connection.escape(new Date()) + " where " +
                        "email=" + connection.escape(data.email)
                    log.debug(sql)
                    connection.query(sql, function (err, results, fields) {
                        // connection.end();
                        connection.release();
                        if (!err) {
                            def.resolve(data.email);
                        } else {
                            def.reject({status: 500, message: config.get('error.dberror')});
                        }
                    })
                }
            });
        }catch(e){
            log.info(e);
            def.reject({status:500,message:config.get('error.dberror')});
        }
        return def.promise;
    },
    unsubreason:function (req) {
        var def=q.defer();
        try{
            pool.getConnection(function(err, connection) {
                if (err) {
                    def.reject();
                } else {
                    var reason = req.body.option
                    if (req.body.option == "other") {
                        var reason = req.body.other_reason
                    }
                    var sql = "update users set unsub_reason=" + connection.escape(reason) + " where " +
                        "email=" + connection.escape(req.body.email)
                    log.debug(sql)
                    connection.query(sql, function (err, results, fields) {
                        // connection.end();
                        connection.release();
                        if (!err) {
                            def.resolve();
                        } else {
                            def.reject({status: 500, message: config.get('error.dberror')});
                        }
                    })
                }
            });
        }catch(e){
            log.info(e);
            def.reject({status:500,message:config.get('error.dberror')});
        }
        return def.promise;
    },
    resubscribe:function (req) {
        var def=q.defer();
        try{
            pool.getConnection(function(err, connection) {
                if (err) {
                    def.reject();
                } else {
                    var sql = "update users set unsub='false',resub_time=" + connection.escape(new Date()) + " where " +
                        "email=" + connection.escape(req.query.email)
                    log.debug(sql)
                    connection.query(sql, function (err, results, fields) {
                        // connection.end();
                        connection.release();
                        if (!err) {
                            def.resolve(req.query.email);
                        } else {
                            def.reject({status: 500, message: config.get('error.dberror')});
                        }
                    })
                }
            });
        }catch(e){
            log.info(e);
            def.reject({status:500,message:config.get('error.dberror')});
        }
        return def.promise;
    },
    sns:function (req) {
        var def=q.defer();
        try{
            var message=JSON.parse(req.body.Message);
            if(message.notificationType=="Bounce"){
                events.emitter.emit("bounce",message.mail);
            }else if(message.notificationType=="Complaint"){
                events.emitter.emit("complaint",message.mail);
            }
        }catch(e){
            log.info(e);
        }
        def.resolve();
        return def.promise;
    }
};
module.exports=runs;