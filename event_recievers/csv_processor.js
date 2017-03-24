/**
 * Created by pariskshitdutt on 24/03/17.
 */
var config= require('config');
var events = require('../events');
var log = require('tracer').colorConsole(config.get('log'));
var request=require('request');
var mysql =require("mysql");
var LineByLineReader = require('line-by-line');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'wunderbrow'
});

events.emitter.on('process_csv',function(data) {
   connection.connect();
    lr = new LineByLineReader(config.get("upload_path")+data);
    lr.on('error', function (err) {
        // 'err' contains error object
    });

    lr.on('line', function (line) {
        // 'line' contains the current line without the trailing newline character.
        var email=line.split(",")[0];
        var campaign_id=line.split(",")[0];
        connection.query('insert into email_campaigns(email,campaign_id)' +
            ' values("'+connection.escape(email)+'","'+connection.escape(campaign_id)+'")'
            ,function(err,results,info){
                if(err){
                    log.warn(err)
                }
            });
    });

    lr.on('end', function () {
        // All lines are read, file is closed now.
        connection.end();
    });

});