var settings={
    "ip":"localhost",
    "db":"webim",
    "host":27071
};
var mongoose=require('mongoose');
mongoose.connect("mongodb://"+settings.ip+"/"+settings.db);
var db=mongoose.connection;
module.exports={
    "dbCon":db,
    "mongoose":mongoose
};
