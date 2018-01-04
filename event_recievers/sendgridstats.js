var config= require('config');
var log = require('tracer').colorConsole(config.get('log'));
var mysql =require("mysql");
var db = mysql.createConnection(config.get("mysql"));
var request = require("request");
var token="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"
var start=new Date((new Date())-(24*60*60*1000));
function fetchdata(){
    var options = { method: 'GET',
        // url: "https://api.sendgrid.com/v3/stats?start_date=2017-01-01",
        url: "https://api.sendgrid.com/v3/stats?start_date="+start.toISOString().split("T")[0],
        qs: { aggregated_by: 'day' },
        headers: { authorization: 'Bearer ' + token },
        body: '{}',
        json:true
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        for(var i=0;i<body.length;i++){
            body[i].stats[0].metrics.date
            body[i].stats[0].metrics.date=new Date(body[i].date);
            saveToDB(body[i].stats[0].metrics)
        }
    });
}
function saveToDB(body){
        var keys=Object.keys(body);
        var names=""
        var values=""
        for(var i=0;i<keys.length;i++){
            if(names==""){
                names=keys[i];
                values=db.escape(body[keys[i]])
            }else{
                if(keys[i]=="date"){
                    body[keys[i]]=(new Date(body[keys[i]])).toISOString()
                }
                names=names+","+keys[i];
                values=values+","+db.escape(body[keys[i]])
            }
        }
        var sql="insert ignore into sendgridreports("+names+") values("+values+");";
        console.log(sql);
        connection.query(sql,function(error,results,fields){
            if(error){
                log.info(error);
            }else{
                log.info(results);
            }
        });
}
setInterval(fetchdata,24*60*60*1000)