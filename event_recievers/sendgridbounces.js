var request = require("request");
var events = require('../events');
var token="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"
function getBounces(offset){
    var start=Math.round((new Date())/1000-(24*60*60));
    var end=Math.round((new Date())/1000);
    var options={
        url:"https://api.sendgrid.com/v3/suppression/bounces?start_time=" + start + "&end_time=" + end + "&offset="+offset+,
        headers:{
            "Authorization":"Bearer "+token
        },
        json:true
    }
    request(options, function (error, response, body) {
        // if (error) throw new Error(error);
        // console.log(body);
        for(var i=0;i<body.length;i++){
            events.emitter.emit("bounce",body[i].email);
        }
        if(body.length==500){
            getBounces(offset+500)
        }
    });
}
function getSpam(offset) {
    var start = Math.round((new Date()) / 1000 - (24 * 60 * 60));
    var end = Math.round((new Date()) / 1000);
    var options = {
        url: "https://api.sendgrid.com/v3/suppression/spam_reports?start_time=" + start + "&end_time=" + end,
        headers: {
            "Authorization": "Bearer "+token
        },
        json: true
    }
    request(options, function (error, response, body) {
        for(var i=0;i<body.length;i++){
            events.emitter.emit("complaint",body[i].email);
        }
    });
}
setInterval(function(){
    getBounces(0)
    getSpam(0)
},5*60*60*1000)