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
            .then(function(email){
                res.render('unsub.ejs',{email:email});
            })
            .catch(function(err){
                res.status(err.status).json(err.message);
            });
    });
router.post('/unsubscribe',
    function(req,res){
        dataLogic.unsubscribe(req)
            .then(function(email){
                res.end();
            })
            .catch(function(err){
                res.status(err.status).json(err.message);
            });
    });
router.post('/unsubreason',
    function(req,res){
        dataLogic.unsubreason(req)
            .then(function(ok){
                res.json(config.get('ok'));
            })
            .catch(function(err){
                res.status(err.status).json(err.message);
            });
    });
router.get('/resubscribe',
    function(req,res){
        dataLogic.resubscribe(req)
            .then(function(email){
                res.render('resub.ejs',{email:email});
            })
            .catch(function(err){
                res.status(err.status).json(err.message);
            });
    });
router.post('/sns',
    function(req,res){
    try{
        req.body=JSON.parse(req.text);
        dataLogic.sns(req)
            .then(function(ok){
                res.json(config.get('ok'));
            })
            .catch(function(err){
                res.status(err.status).json(err.message);
            });
    }catch(e){
        res.status(400).json(config.get("error.badrequest"));
    }
    });
router.get('/linker',
    function(req,res){
        var redirect=config.get("redirect");
        var keys=Object.keys(redirect);
        for(var i=0;i<keys.length;i++){
            var re = new RegExp(keys[i],"g");
            req.query.url=req.query.url.replace(re,redirect[keys[i]])
        }
        if(req.query.url){
            if(req.query.url.indexOf("http://")==-1&&req.query.url.indexOf("https://")==-1){
                req.query.url="http://"+req.query.url;
            }
            log.info(req.query.url);
            res.redirect(req.query.url);
        }else{
            res.end();
        }
    });
router.get('/clicker/:data',
    function(req,res){
        dataLogic.clickTracker(req)
            .then(function(url){
                log.info(url);
                res.redirect(302,url);
            })
            .catch(function(){
                res.end();
            })
    });
router.post('/sendgrid/hook/',
    function(req,res){
        dataLogic.processdata(req)
            .then(function(url){
                res.json(config.get("ok"));
            })
            .catch(function(){
                res.end();
            })
    });
router.post('/email',
    function(req,res){
        dataLogic.insertEmail(req)
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


