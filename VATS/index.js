var parse=require('./deviceparser_module.js');
var parser;
var express=require('express');
const app=express();
const body_parser=require('body-parser');
var message='';
app.use(body_parser.json());
app.use(body_parser.urlencoded({
    extended:true
}));
new parse().data_message("12345678&&1&&1.20&&13.7,14.7&&0.23&&2018-03-04 12:00:00");
app.post('/deviceparse',function(req,res){
    message=req.body.message;
    if(message.split("&&")[1]==0){
        new parse().login_message(message);
    }
    if(message.split("&&")[1]==1)
        new parse().data_message(message);
});

app.listen(3000);