const mysql=require("mysql2");
const {HOST,USER,PASSWORD,DATABASE}=process.env
const db=mysql.createConnection({
    host:HOST,
    user:USER,
    password:PASSWORD,
    database:DATABASE
});
db.connect(function(err){
    if(err)throw err;
    console.log("connected");
})
module.exports=db;
