
var db=require('./db_query.js');
var onesignal=require('./onesignalModule.js');
var db_query=new db();
var parsemessage=function(){
this.login_message=function(message){
    this.message=message;
    this.split_message=this.message.split("&&");
    this.split_message.push('0');
    this.split_message.splice(1,1);
//    this.query="INSERT INTO devicelist(sess_id,device_id,password,armed) VALUES ?";
    this.query="Select * from devicelist where device_id=?";
    db_query.performOps(this.query,[[this.split_message[1]]],this.split_message,function(result,split_message){
        if(result.length==0)
            console.log("Device not found.Please log in");
        else{
            console.log(split_message);
            params=[Math.floor(Math.random()*89999999+10000000).toString(),split_message[1]];
            db_query.performOps("UPDATE devicelist SET sess_id = ? WHERE device_id = ?",params,split_message,function(result,split_message){});    
        }
    });
    };
this.data_message=function(message){
    this.message=message;
    this.split_message=this.message.split("&&");
    this.split_message.splice(1,1);
    this.query="Select * from devicelist where sess_id=?";
    db_query.performOps(this.query,[[this.split_message[0]]],this.split_message,function(result,split_message){
        
        if(result.length==0)
            console.log("Device not found .Please log in");
        else{
            if(result[0].armed=="1" && (Number(split_message[1])>1 || Number(split_message[3])>1 )){
                console.log("Notify");
                onesignal(  
                 { 
                      app_id: "fc42fee4-4f8f-4bf9-a7e3-1ffeb858f0da",
                      contents: {"en": "Vehicle has started"},
                      included_segments: ["All"]
                    });
            }
            var params=[result[0].device_id,split_message[1],split_message[2],split_message[3],split_message[4]];
            db_query.performOps("INSERT INTO current_sensor_data(device_id,vib_sen_data,location,amm_sens_data,log_time) VALUES ? ON DUPLICATE KEY UPDATE vib_sen_data=VALUES(vib_sen_data),location=VALUES(location),amm_sens_data=VALUES(amm_sens_data),log_time=VALUES(log_time)",[[params]],split_message,function(result,split_message){});
            
        }
        });
    
}
};
module.exports=parsemessage;
