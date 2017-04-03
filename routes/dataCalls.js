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
var multer  = require('multer');
var base64 = require('base-64');
var upload = multer({ dest: 'uploads/campaigns' })



// router.get('/redirect/:url',
//     function(req,res){
//         dataLogic.updateClicks(req)
//             .then(function(ok){
//                 log.info(ok);
//                 res.redirect(base64.decode(req.params.url.replace(".jpg","")));
//             })
//             .catch(function(err){
//                 log.info(err);
//                 res.status(err.status).json(err.message);
//             });
//     });

router.get('/unsubscribe',
    function(req,res){
        dataLogic.unsubscribe(req)
            .then(function(ok){
                res.json(config.get('ok'));
            })
            .catch(function(err){
                res.status(err.status).json(err.message);
            });
    });
router.post('/bounce',
    function(req,res){
    console.log(req.body,req.text,req.headers);
        dataLogic.bounce(req)
            .then(function(ok){
                res.json(config.get('ok'));
            })
            .catch(function(err){
                res.status(err.status).json(err.message);
            });
    });

router.post('/campaign_complete',upload.single("csv"),
    function(req,res){
        dataLogic.addEmail(req)
            .then(function(ok){
                res.json(config.get('ok'));
            })
            .catch(function(err){
                res.status(err.status).json(err.message);
            });
    });
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


