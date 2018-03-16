//server.js
//Contains main server request response code and calls CRUD implementation model
var express=require('express');
const jwt=require('jsonwebtoken');
var app=express();
var bodyParser=require('body-parser');
var mysqlOps=require('./app/models/vats_db');//get the mysql model
var cryptoJs=require('crypto-js');
var config=require('./config');
var key=config.secretKey;
app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(bodyParser.json());
//The if prevents loading of environment variables from .env files when running on production
//Remember to add .env to gitignore before commit
if(process.env.NODE_ENV!='production'){
    require('dotenv').load();
}
app.use(function (req, res, next){
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://0.0.0.0:8100');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});
//get port value from environment variables .Default set it to 3200
const port=process.env.PORT || config.nodePort;
var router=express.Router();//get instance of Router
router.use(function(req,res,next){
    //declares use of router and is very powerful for performing validation before passing to all routes
console.log("There is a request");
//request has to be sent to all routes hence next()
next();
});
router.get("/",function(req,res){
res.json({
    message:'Hey this is my first api'
});
});
app.use('/api',router);
router.route('/users')
//for create user in CRUD generate a POST to http://hostname:port/api/users
.post(function(req,res){
  
    reqData= Object.keys(req.body)
 
   new mysqlOps().create("INSERT INTO user_details SET ?",{   
       "user_name":reqData[1],
        "address":reqData[2],
        "mob_number":reqData[3],
        "email_id":reqData[4],
        "password":reqData[5],
       "token":""
    },
    function(result){
        var response=res;
        res.send(result);
    }); 
})
//for selecting user in CRUD generate a GET to http://hostname:port/api/users
.get(function(req,res){
   new mysqlOps().select("Select * from user_details ",
    function(result){
        var response=res;
        res.send(result);
    }); 
});

router.route('/getSensorData')
.get(verifytoken,function(req,res){
    jwt.verify(req.token,key,function(err,authData){
        if(err){
            res.sendStatus(403);
            console.log(err);
        }
        else{
        new mysqlOps().select("Select * from current_sensor_data c LEFT JOIN devicelist d ON  c.device_id=d.device_id where c.device_id='VATS01' ",
    function(result){
        var response=res;
        res.send(result);
    });
    }
    }); 
 });

//api for login ,client independent
router.route("/login")
.post(function(req,res){
    //Select user from db based on emailid from request body
    console.log("Hey");
    new mysqlOps().selectSingleUser("Select * from user_details where email_id='"+req.body.object.email_id+"' and password='"+req.body.object.password+"'",
    req.body.object.email_id,
    function(result){
        var email_id=req.body.object.email_id.slice(req.body.object.email_id.length-1,1);
        var password=req.body.object.password.slice(req.body.object.password.length-1,1);
        console.log(email_id,password);
        var response=res;
        if(result.length==0){
            //No emailId matched
            response.sendStatus(403);    
        }else{
            //EmailId matched .Check Password
            if(result[0].password==password){
                //Password Check success generate JWT
            jwt.sign({email_id},key/*,{expiresIn:'1000s'}*/,function(err,token){
             if(err)
                //if err FORBIDDEN
                response.sendStatus(403);
             else
                //Send JWT as Reponse JSON
                response.json({
                    status:200,
                    token:token,
                    result:result[0]
                });   
            });
        }
        else
            //Password didnt match
            response.sendStatus(403);
        }

  //      res.send(result);
    }); 
});
router.route("/armDeviceControl/:armData")
.get(verifytoken,function(req,res){
    if(req.params.armData=="true"){
        req.params.armData=1
    }
    else{
        req.params.armData=0;
    }
    jwt.verify(req.token,key,function(err,authData){
    if(err){
        res.sendStatus(403);
        console.log(err);
    }
    else{
        new mysqlOps().updateDevice("update vats.devicelist set armed=? where device_id='VATS01'",
    req.params.armData,
    function(result){
        var response=res;
        console.log(result);
        if(result=="ERROR")
        res.sendStatus(403);
        else if(result=="SUCCESS")
        res.send("SUCCESS");    
    });
    }
});1
});
router.route("/updateToken/:data")
.get(verifytoken,function(req,res){
    jwt.verify(req.token,key,function(err,authData){
    if(err){
        res.sendStatus(403);
        console.log(err);
    }
    else{
        console.log(req.params);

        new mysqlOps().updateUser("update vats.user_details set token='"+req.params.data.split("::")[0]+"' where email_id='"+req.params.data.split("::")[1]+"'",
    "",
    function(result){
        var response=res;
        console.log(result);
        if(result=="ERROR")
        res.sendStatus(403);
        else if(result=="SUCCESS")
        res.send("SUCCESS");    
    });
    }
});
});
router.route("/users/:emailId")
//for selecting a single user in CRUD generate a GET to http://hostname:port/api/users/:emailId
//Protected route check JWT headers using verifytoken()
.get(verifytoken,function(req,res){
    //if verifytoken confirms auth header present exec rest
    jwt.verify(req.token,key,function(err,authData){
        if(err)
        res.sendStatus(403);
        else{
            //Successful JWT match
            new mysqlOps().selectSingleUser("Select * from user_details where email_id=? ",
            req.params.emailId,
            function(result){
                var response=res;
                res.send(result);
            }) 
        }
    });
})
//for selecting a single user in CRUD generate a GET to http://hostname:port/api/users/:emailId
.delete(function(req,res){
    console.log(req.params.emailId);
    new mysqlOps().deleteSingleUser("Delete from user_details where email_id=? ",
    cryptoJs.HmacSHA1(key,req.params.emailId).toString(),
    function(result){
        var response=res;
        res.send(result);
    }) 
});
function verifytoken(req,res,next){
    //Extract auth header 
    const bearer=req.headers['authorization'];
    //Check if auth header defined
    if(typeof(bearer)!='undefined'){
        //Extract JWT from header of format "authorization":"Bearer JWT_TOKEN "
        const token=bearer.split(' ');        
        //extract token
        var tokenbearer=token[1];
        console.log(tokenbearer);
        req.token=tokenbearer;
        //Pass to next route where verify is called
        next();
    }
    else
        //No authorization header found
        res.sendStatus(403);
}
app.listen(port);//start server on specified port
