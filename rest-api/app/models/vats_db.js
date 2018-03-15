var mysql=require('mysql');
var config=require('./../../config');
//Create a pool to process parallel requests to server
var connection=mysql.createPool({
    host:process.env.MYSQL_HOST || config.MYSQL_HOST ,
    debug:true,
    connectionLimit:100,
    database:process.env.MYSQL_DBNAME || config.MYSQL_DBNAME,
    user:process.env.USER || config.MYSQL_USER,
    password:process.env.MYSQL_PASSWORD || config.MYSQL_PASSWORD
});
//function holds CRUD implementation of database
var mysqlOps=function(){
var error=new Array();
//function to handle any errors that occur and display in call
var catch_error=function(err,callback){
    console.log(err.code);
    error.push(err.code);
   error.map(function(val){
    console.log("Error occurred",val);
    callback(err.code);
   },function(){
       process.exit();
   });
};

//this.create holds insert implementation for the api
this.create=function(query,paramObject,callback){
//get a connection from pool log if error and release else use callback to query
    connection.getConnection(function(err,connection_callback){
        if(err){
            catch_error(err,callback);
            connection_callback.release();//release in case we cannot connect
        }
        connection_callback.query(query,paramObject,function(err,results,fields){
            if(err){
            catch_error(err,callback);
            }
            callback(results);
        });
    connection_callback.end();//end once done
    });
};
//this.select returns select implementation for the api
this.select=function(query,callback){
    //get a connection from pool log if error and release else use callback to query
        connection.getConnection(function(err,connection_callback){
            if(err){
                catch_error(err,callback);
                connection_callback.release();//release in case we cannot connect
            }
            connection_callback.query(query,function(err,results,fields){
                if(err){
                catch_error(err,callback);
                }
                callback(results);
            });
        connection_callback.end();//end once done
        });
    };
//this.selectSingleUser returns select implementation for the single user for api
this.selectSingleUser=function(query,params,callback){
    //get a connection from pool log if error and release else use callback to query
        connection.getConnection(function(err,connection_callback){
            if(err){
                catch_error(err,callback);
                connection_callback.release();//release in case we cannot connect
            }
            connection_callback.query(query,params,function(err,results,fields){
                if(err){
                catch_error(err,callback);
                }
                callback(results);
            });
        connection_callback.end();//end once done
        });
    };
    //this.updateSingleUser returns update implementation for the api
this.updateUser=function(query,params,callback){
    //get a connection from pool log if error and release else use callback to query
        connection.getConnection(function(err,connection_callback){
            if(err){
                catch_error(err,callback);
                connection_callback.release();//release in case we cannot connect
            }
            connection_callback.query(query,params,function(err,results,fields){
                if(err){
                catch_error(err,callback);
                }
                callback(results);
            });
        connection_callback.end();//end once done
        });
    };
        //this.updateSingleUser returns update implementation for the api
    this.updateDevice=function(query,params,callback){
        //get a connection from pool log if error and release else use callback to query
            connection.getConnection(function(err,connection_callback){
                if(err){
                    catch_error(err,callback);
                    connection_callback.release();//release in case we cannot connect
                }
                connection_callback.query(query,params,function(err,results,fields){
                    if(err){
                    catch_error(err,callback);
                results="ERROR";    
                }
                else 
                    results="SUCCESS";
                    callback(results);
                });
            connection_callback.end();//end once done
            });
        };
    //this.deleteSingleUser returns select implementation for the single user for api
this.deleteSingleUser=function(query,params,callback){
    //get a connection from pool log if error and release else use callback to query
        connection.getConnection(function(err,connection_callback){
            if(err){
                catch_error(err,callback);
                connection_callback.release();//release in case we cannot connect
            }
            connection_callback.query(query,params,function(err,results,fields){
                if(err){
                catch_error(err,callback);
                }
                callback(results);
            });
        connection_callback.end();//end once done
        });
    };
};
module.exports=mysqlOps;