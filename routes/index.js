var express = require('express');
var app=express();
var server=require('http').Server(app);
var io=require('socket.io')(server);
var router = express.Router();
var path=require('path');
var crypto = require('crypto');
var User=require('../models/user');
server.listen(80);
/* GET home page. */

router.get('/', function(req, res) {
  var abRootaPath= path.resolve(__dirname,'../views/');
  var options={
      root:abRootaPath,
      dotfiles:'deny'
  };
    var socks={};
  res.sendFile('client.html',options);
    io.on('connection',function(socket){
        console.log('connect');
        socket.on('setUsername',function(msg){
            console.log(msg);
            if(msg in socks){
               console.log("user exist");
            }else{
                socket.user=msg;
                socks[msg]=socket;
            }
            //console.log(users);
        });
        socket.on("chatMessage",function(content){
            //接收到客户端发来的用户名自定义事件的时候
            //再转发给接收者
//            console.log(users);
            console.log("mes");
            if(content.to in socks){
                var id=socks[content.to].conn.id;
                //console.log(io.sockets);
                io.sockets.to(id).emit(content.to,content);
            }
        });
        socket.on('disconnect', function () {
            console.log('server disconnected');
            socket.disconnect();
            delete socks[socket.user];
        });
    });
});
router.post('/getAllUser',function(req,res){
User.find({},function(err,users){
    if(err){
        res.send('fail');
        return;
    }
    res.send(JSON.stringify(users));
});
});
router.post('/reg',function(req,res){
    var md5=crypto.createHash('md5');
    var password=md5.update(req.body.password).digest('base64');
    var newUser=new User({
        name:req.body['username'],
        password:password,
        isLogin:true
    });
    User.findOne({name:newUser.name},function(err,user){
        if(user){
            res.send('user exists');
            return;
        }
        if(err){
            res.send('fail');
            return;
        }
        newUser.save(function(err){
            if(err){
                res.send('fail');
                return;
            }
            res.send(JSON.stringify(newUser));
        });

    });
});
router.post('/login',function(req,res){
    var md5=crypto.createHash('md5');
    var password=md5.update(req.body.password).digest('base64');
    User.findOne({name:req.body.username},function(err,user){
        if(err){
            res.send('fail');
            return;
        }
        if(!user){
            res.send('no user');
            return;
        }
        else if(user){
            if(user.password!=password){
                res.send('invalid password');
            }
            else{
                res.send(JSON.stringify(user));
                user.isLogin=true;
                user.save();
            }
        }
    });
});
//退出登陆
router.post('/logout',function(req,res){
    var username=req.body.username;
    console.log(username);
    User.findOne({name:username},function(err,user){
        if(user){
            user.isLogin=false;
            user.save();
        }
    })
});
module.exports = router;
