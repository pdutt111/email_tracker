var express = require('express');
var router = express.Router();
var params = require('parameters-middleware');
var config= require('config');
var jwt = require('jwt-simple');
var ObjectId = require('mongoose').Types.ObjectId;
var moment= require('moment');
var async= require('async');
var multer=require('multer');
// var db=require('../db/DbSchema');
var events = require('../events');
var log = require('tracer').colorConsole(config.get('log'));
var apn=require('../notificationSenders/apnsender');
var gcm=require('../notificationSenders/gcmsender');
var dataLogic=require('../logic/Data');


router.get('/:pixel_name',
    function(req,res){
        dataLogic.updateTracker(req)
            .then(function(ok){
                res.sendfile('public/pixel.jpg');
            })
            .catch(function(err){
                res.status(err.status).json(err.message);
            });
    });


module.exports = router;


