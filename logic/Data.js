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

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'wunderbrow'
});

var runs={
    updateTracker:function(req){
        var def=q.defer();
        try{
            // console.log(JSON.parse(base64.decode(req.params.pixel_name.replace(".jpg",""))));
            var input=JSON.parse(base64.decode(req.params.pixel_name.replace(".jpg","")))
            connection.connect();
            connection.query("update "+input.table+" set "+input.field+"=1 where email="+input.email+" and campaign_id="+input.campaign_id,function(err,results,fields){

            })
        }catch(e){
            console.log(e);
        }
        def.resolve();
        return def.promise;
    },
    addEmail:function(req){
        var def=q.defer();
        try{
            console.log(req.query);
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
    }
};
module.exports=runs;