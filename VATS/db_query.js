var mysql=require('mysql');
var connection=mysql.createPool({
    connectionLimit:100,
    user:"root",
    password:"root",
    host:"localhost",
    database:"vats",
    debug:false
});

var db_query=function(){
this.performOps=function(query,data,alldata,callback){
    connection.getConnection(function(err,connection_callback){
        if(err){
            throw err;
        connection_callback.release();
        }

    connection_callback.query(query,data,function(err,results,fields){
        console.log(data);
        console.log("executed",results);
        callback(results,alldata);
    });
    connection_callback.end();
    });
}
};

module.exports=db_query;


