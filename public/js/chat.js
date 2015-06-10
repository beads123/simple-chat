define(['utility','userinterface','config'], function (util,ui,conf) {
    return {
        connection:function(username){
            console.log('connect');
            currentSocket=io(conf.server+conf.port,{ 'connect timeout': 5000});
                var that=this;
            currentSocket.emit("setUsername",username);
            //接受服务器传来的用户名自定义事件
            currentSocket.on(username,function(msg){
                that.reveiveMessage(msg);
            });
            //当断开链接的时候，注销事件监听
            currentSocket.on('disconnect',function(){
                //window.currentSocket=null;
                currentSocket=null;
                console.log('disconnect');
                //注销用户登陆
                //util.sendAjax('post','/logout',username);
            });
            currentSocket.on('connect_failed', function ( data ) {
                that.closeConnect();
            });

            currentSocket.on('reconnect_failed', function ( data ) {
                that.closeConnect();
            });

            currentSocket.on('error', function ( data ) {
                that.closeConnect();
            });

            currentSocket.on('custom_error', function ( data ) {
                console.log(data.message);
                //main_chat_disconnect();
            });

            currentSocket.on('disconnect', function ( data ) {
                that.closeConnect();
            });

            currentSocket.on('connect_timeout', function ( data ) {
                that.closeConnect();
            });
        },
        bindSendMessage:function(){
            var oSendBtn=document.getElementById('send_btn');
            var that=this;
            if(util.isTouchScreen(oSendBtn)){
                oSendBtn.ontouchstart=that.sendMessage;
            }else{
                oSendBtn.onclick=that.sendMessage;
            }
        },
        //发送消息
        sendMessage:function(){
            var oInput=document.querySelectorAll('#talk_footer input[type=text]')[0];
            var reg=/^\s{0,}$/g;
            var oTalkContentPanel=document.getElementById('talk_content');
            //发送者
            var from=JSON.parse(localStorage.getItem('currentUser')).name;
            //接收者
            var to=util.strTrim(document.getElementById('user_des').innerText);
            //发送的原始内容
            var oContent=oInput.value;
            if(reg.test(oContent)){
                return;
            }
            //显示的内容
            var oSendShowContent= "<div class='wrappersend'><p class='send'>"+oInput.value+"</p><span class='sender'>"+from+"</span></div>";
                oSendShowContent=util.replaceEmotion(oSendShowContent);
            var data={
                from:from,
                to:to,
                content:oContent+"*"+new Date().getTime()
            };
            var oChatCache=JSON.parse(localStorage.getItem(to));
            if(oChatCache){
                    oChatCache.push(data);
                    localStorage.setItem(to,JSON.stringify(oChatCache));
            }else{
                var oCache=[];
                oCache.push(data);
                localStorage.setItem(to,JSON.stringify(oCache));
                //给对话列表添加一项
                ui.addToTalkList(to);
            }
            oTalkContentPanel.innerHTML+=oSendShowContent;
            ui.scrollToBottom(oTalkContentPanel);
            oInput.value="";
            //关闭表情菜单
            ui.toggleFaceRegion(1);

            //发送消息给服务器
            currentSocket.emit('chatMessage',data);

        },
        //接收其他用户发来的消息
       reveiveMessage:function(msg){
           //接收到信息后缓存到本地
           var oReceiveShowContent= "<div class='wrapperreceive'><span class='receiver'>"+msg.from+"</span><p class='receive'>"+msg.content+"</p></div>";
           oReceiveShowContent=util.replaceEmotion(oReceiveShowContent);
           var oTalkContent=document.getElementById('talk_content');
           var oChatCache=JSON.parse(localStorage.getItem(msg.from));
           var flag=false;
           //防止重复接受
           if(oChatCache){
               var oLastContent=oChatCache[oChatCache.length-1];
               if(oLastContent.content!=msg.content) {
                   oChatCache.push(msg);
                   localStorage.setItem(msg.from, JSON.stringify(oChatCache));
                   flag = true;
               }
           }else{
               var oCache=[];
               oCache.push(msg);
               localStorage.setItem(msg.from,JSON.stringify(oCache));
               flag=true;
           }
               if(flag){
                   //如果当前打开的对话框是接收到信息的发送者,如果不是，显示通知
                   if(this.isCurrentTalkOpen(msg.from)){
                       oTalkContent.innerHTML+=oReceiveShowContent;
                       ui.scrollToBottom(oTalkContent);
                   }else{
                       //如果打开的标签页是第一个标签页，不显示通知图标，否则显示
                       if(!this.isTalkItemOpen()){
                           ui.toggleTabNoticification(0);
                       }
                       if(!this.isExistsListItem(msg.from)){
                           ui.addToTalkList(msg.from);
                       }

                   }
               }
       },
        //判断当前会话框是否打开并且正在对话的人是否是接收到信息的发送者
       isCurrentTalkOpen:function(username){
           var oTalkPanel=document.getElementById('talk_panel');
           var oSpan=document.getElementById('user_des');
           if(!util.hasClass(oTalkPanel,'invisible')&&oSpan.innerText==username){
               return true;
           }else{
               return false;
           }
       },
        //判断当前切换的标签页是不是对话标签页
        isTalkItemOpen:function(){
            var oUl = document.getElementById('item_ul');
            var oItem= oUl.getElementsByTagName('li')[0];
            return util.hasClass(oItem,'item_active')?true:false;
        },
        //判断第一个标签页中是否已经存在当前对话
        isExistsListItem:function(username){
            var oUserPanel=document.getElementById('user_panel');
            var oLiArr=oUserPanel.getElementsByTagName('li');
            if(!oLiArr.length){
                return false;
            }
            for(var i=0;i<oLiArr.length;i++){
                if(oLiArr[i].innerText.indexOf(username)!=-1){
                    return true;
                }
            }
            return false;
        },
        //绑定表情选择事件
        bindEmotionClick:function(){
          var oSpanArr=document.querySelectorAll('#face_ul li span');
          var oContent=document.querySelector('#talk_footer input[type=text]');
          var isTouch=util.isTouchScreen(oSpanArr[0]);
           for(var i=0;i<oSpanArr.length;i++){
               if(isTouch){
                   oSpanArr[i].ontouchstart=function(){
                       var emotionId=this.getElementsByTagName('i')[0].className.split("-")[1];
                       oContent.value+='['+emotionId+']';
                   }
               }else{
                   oSpanArr[i].onclick=function(){
                       var emotionId=this.getElementsByTagName('i')[0].className.split("-")[1];
                       oContent.value+='['+emotionId+']';
                   }
               }

           }
        },
        closeConnect:function(){
            if(currentSocket){
                currentSocket.disconnect();
                //alert('disconnect');
            }
        }
    };
});

