var mongoose=require('../db').mongoose;
var schema= new mongoose.Schema({
    name:String,
    password:String,
    isLogin:Boolean
});
var User=mongoose.model('User',schema);
module.exports=User;
