/**
 * Created by pariskshitdutt on 03/04/17.
 */
var config= require('config');
var events = require('../events');
var log = require('tracer').colorConsole(config.get('log'));
var q=require("q");
var mysql =require("mysql");
var connection = mysql.createConnection(config.get("mysql"));
connection.connect();
events.emitter.on('click',function(data){
    console.log("click event received",data);
    saveToDB(data)
        .then(function(){

        })
        .catch(function(){

        })
});
function saveToDB(data_obj){
    var def=q.defer();
    var post_obj=data_obj;
    var keys=Object.keys(post_obj);
    var names="";
    var vals="";
    for(var i=0;i<keys.length;i++){
        var value=post_obj[keys[i]];
        if(keys[i].indexOf("time")>-1){
            value=new Date(value);
        }
        if(i==0){
            names=keys[i];
            vals=connection.escape(value);
        }else{
            names=names+","+keys[i];
            vals=vals+','+connection.escape(value);
        }
    }
    var sql="replace into sendgridclicks("+names+") values("+vals+")"
    console.log(sql)
    connection.query(sql,function(err,results,fields){
        if(!err){
            def.resolve();
        }else{
            def.reject();
        }
    });
    return def.promise;
}