var mysql=require('mysql-ssh');

mysql.connect(
    {
        host:'40.71.199.63',
        user:'vinayprithiani',
        password:'vinayp_30102017',

    },{
        connectionLimit:100,
        user:"root",
        password:"root",
        database:"data_logger",
        debug:false
    }
)
.then(client=>{
    client.query("SELECT distinct a.device_id,b.gas_level,b.gas_detector,b.gas_leak,b.low_gas,b.power_level,c.coordinates,log_time,d.ang2_threshold,d.ang2_lower_limit,d.ang3_threshold,d.ang3_lower_limit,e.http_post_interval FROM user_device_list a,device_log_current b,devicelist c left join analog d on c.device_id=d.device_id left join slave_config e on c.device_id=e.device_id  where  a.user_id='125423' and a.device_id = b.device_Id and a.device_id = c.device_id", function (err, results, fields) {
        if (err) throw err
            results.map(function(value,i){
                client.query(" SELECT * from session_log where device_id='"+value.device_id+"' ORDER BY _id DESC LIMIT 1", function (err, result_id, fields){
                        results[i]["server_log_time"]=result_id[0].log_time;
                 if(i==results.length-1)
                    console.log(results);
                    });                   
            });
    });
})
.catch(err=>{console.log(err)});