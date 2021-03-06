/**
 * Created by pariskshitdutt on 24/03/17.
 */
var config= require('config');
var events = require('../events');
var log = require('tracer').colorConsole(config.get('log'));
var request=require('request');
var mysql =require("mysql");
var LineByLineReader = require('line-by-line');
var pool = mysql.createPool(config.get('mysql'));
events.emitter.on('process_csv',function(data) {
    lr = new LineByLineReader(config.get("upload_path")+data);
    lr.on('error', function (err) {
        // 'err' contains error object
    });

    lr.on('line', function (line) {
        // 'line' contains the current line without the trailing newline character.
        try{
            var email=line.split(",")[0];
            var campaign_id=line.split(",")[1];
            var send_time=new Date(line.split(",")[2].replace(/"/g,""));
            // log.debug(email,campaign_id,send_time);
            pool.getConnection(function(err, connection) {
                if (err) {
                    def.reject();
                } else {
                    var sql = 'insert into email_campaigns(email,campaign_id,send_time)' +
                        ' values(' + connection.escape(email.replace(/"/g, "")) + ',' + connection.escape(campaign_id.replace(/"/g, "")) +
                        "," + connection.escape(send_time) + ')'
                    connection.query(sql
                        , function (err, results, info) {
                            connection.release();
                            if (err) {
                                log.warn(err)
                            }
                        });
                    var sql = 'insert into users(email)' +
                        ' values(' + connection.escape(email.replace(/"/g, "")) + ')'
                    connection.query(sql
                        , function (err, results, info) {
                            connection.release();
                            if (err) {
                                log.warn(err)
                            }
                        });
                }
            });
        }catch(e){}
    });

    lr.on('end', function () {
        // All lines are read, file is closed now.
        // connection.end();
    });

});