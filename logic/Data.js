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
var connection = mysql.createConnection(config.get("mysql"));
connection.connect();

var runs={
    updateTracker:function(req){
        var def=q.defer();
        try{
            log.info(req.params);
            var input=JSON.parse(base64.decode(req.params.pixel_name.replace(".jpg","")))
            var sql="update email_campaigns set status=1,open_time="+connection.escape(new Date())+" where " +
                "email="+connection.escape(input.email)+"and campaign_id="+connection.escape(input.campaign_id);
            connection.query(sql,function(err,results,fields){
                // connection.end();
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
            var sql="update email_campaigns set unsub='true',unsub_time="+connection.escape(new Date())+" where " +
                "email="+connection.escape(req.query.email)+"and campaign_id="+connection.escape(req.query.campaign_id);
            log.debug(sql)
            connection.query(sql,function(err,results,fields){
                // connection.end();
                if(!err){
                    def.resolve();
                }else{
                    def.reject(config.get('error.dberror'));
                }
            })
        }catch(e){
            console.log(e);
        }
        return def.promise;
    },
    bounce:function (req) {
        var def=q.defer();
        try{
            var sql="update email_campaigns set bounce='true',bounce_time="+connection.escape(new Date())+" where " +
                "email="+connection.escape(req.query.email)+"and campaign_id="+connection.escape(req.query.campaign_id);
            log.debug(sql)
            connection.query(sql,function(err,results,fields){
                // connection.end();
                if(!err){
                    def.resolve();
                }else{
                    def.reject(config.get('error.dberror'));
                }
            })
        }catch(e){
            console.log(e);
        }
        return def.promise;
    }
};
module.exports=runs;