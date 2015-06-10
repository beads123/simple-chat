//用户界面处理操作
define(['utility','swipe'], function (util,swipe) {
    return {
        bindItemClick:function(){
            var oUl = document.getElementById('item_ul');
            var oLiArr=oUl.getElementsByTagName('li');
            var isTouch=util.isTouchScreen(oLiArr[0]);
            var that=this;
            for(var i=0;i<oLiArr.length;i++){
                oLiArr[i].index=i;
                if(isTouch){
                    oLiArr[i].ontouchstart=function(){
                        that.setTabItem(this,this.index);
                    }
                }else{
                    oLiArr[i].onclick=function(){
                        that.setTabItem(this,this.index);
                    }
                }
            }
        },
        //绑定左右滑动事件
        bindItemSwipe:function(){
            var oUser=document.getElementById('user_panel');
            var oContacts=document.getElementById('contacts');
            var oSetting=document.getElementById('settings');
            var oUl = document.getElementById('item_ul');
            var oLiArr=oUl.getElementsByTagName('li');
            var that=this;
            swipe.bind(oUser,{
               "swipeleft":function(){
                  util.removeClass(oContacts,'goback');
                  util.addClass(oContacts,'goreg');
                  that.setTabItem(oLiArr[1],1);
                }
            });
            swipe.bind(oContacts,{'swipeleft':function(){
                util.addClass(oSetting,'goreg');
                that.setTabItem(oLiArr[2],2);
            },"swiperight":function(){
                util.addClass(oUser,'goback');
                that.setTabItem(oLiArr[0],0);
            }});
            swipe.bind(oSetting,{
                "swiperight":function(){
                    util.removeClass(oContacts,'goreg');
                    util.addClass(oContacts,'goback');
                    that.setTabItem(oLiArr[1],1);
                }
            });
        },
        bindSearchClose:function(){
          var oCloseBtn=document.querySelector('.search_back');
            var that=this;
          if(util.isTouchScreen(oCloseBtn)){
              oCloseBtn.ontouchstart=that.closeSearchPanel;
          }else {
              oCloseBtn.onclick= that.closeSearchPanel;
          }
        },
        setTabItem: function (obj, index) {
            var oUl = document.getElementById('item_ul');
            var oItemArr = oUl.getElementsByTagName('li');
            var oHead = document.getElementById('tab_head');
            var isTouch=util.isTouchScreen(oHead);
            var oChatPanel=document.getElementById('chat_panel');
            for (var i = 0, len = oItemArr.length; i < len; i++) {
                util.removeClass(oItemArr[i], 'item_active');
            }
            var oUlArr = oChatPanel.getElementsByTagName('ul');
            oUlArr=util.makeDomArray(oUlArr).slice(0,3);
            for (var i = 0, len = oUlArr.length; i < len; i++) {
                util.addClass(oUlArr[i], 'hidden');
            }
            util.addClass(obj, 'item_active');
            util.removeClass(oUlArr[index], 'hidden');
            //根据所选的选项卡设置header
                switch (index){
                    case 0:
                        oHead.innerHTML='会话';
                        break;
                    case 1:
                        if(isTouch){
                            oHead.innerHTML="联系人<span class='search_users' ontouchstart='showSearchPanel();'><i class='fa fa-search'></i></span>";
                        }else{
                            oHead.innerHTML="联系人<span class='search_users' onclick='showSearchPanel();'><i class='fa fa-search'></i></span>";
                        }
                        break;
                    case 2:
                        oHead.innerHTML='设置';
                        break;
                    default :
                        break;
                }
            //当切换到这个标签页的时候，移除通知图标
        toggleTabNoticification(index,1);
        },
        //初始化用户界面
        initialUserPanel: function () {
            var oHeader = document.getElementById('logo_uname');
            var oLogin = document.getElementById('login');
            var oRegister = document.getElementById('register');
            var oUserDiv = document.getElementById('user_div');
            var oSettingUname = document.getElementById('setting_uname');
            var currentUser = JSON.parse(localStorage.getItem('currentUser'));
            util.addClass(oLogin, 'hidden');
            util.addClass(oRegister, 'hidden');
            util.removeClass(oUserDiv, 'hidden');
            oHeader.innerText = currentUser.name;
            oSettingUname.innerText = currentUser.name;
        },
        showTalkPanel: function () {
            var oContacs=document.getElementById('contacts');
            var that=this;
            var isTouch=util.isTouchScreen(oContacs);
            var oLiArr1=util.makeDomArray(oContacs.getElementsByTagName('li'));
            for (var i = 0, len = oLiArr1.length; i < len; i++) {
                if(isTouch){
                    oLiArr1[i].ontouchstart=function(){
                        that.showTalkPanelClick(this.innerText);
                    };
                }else{
                    oLiArr1[i].onclick=function(){
                        that.showTalkPanelClick(this.innerText);
                    };
                }
            }
        },
        //打开和某人的对话框
        showTalkPanelClick:function(username){
            var oChatPanel = document.getElementById('chat_panel');
            var oTalkPanel = document.getElementById('talk_panel');
            var talkContent=document.getElementById('talk_content');
            var oSearchPanel=document.getElementById('search_panel');
            var oSpan = document.getElementById('user_des');
            var oWidth = document.body.offsetWidth;
            oSpan.innerText = util.strTrim(username);
            if (oWidth <= 1024) {
                util.addClass(oChatPanel, 'invisible');
            }
            util.addClass(oSearchPanel, 'invisible');
            talkContent.innerHTML="";
            talkContent.innerHTML=this.readTalkHistory(username);
            util.removeClass(oTalkPanel, 'invisible');
            util.addClass(oTalkPanel, 'show_talk_panel');
            this.scrollToBottom(talkContent);
            this.hideUrlBar();
        },
        //读取本地对话记录拼接成字符串返回
        readTalkHistory:function(username){
           var html="";
           var talkHistory=JSON.parse(localStorage.getItem(username));
            util.each(talkHistory,function(item){
                if(item.from==username){
                    html+="<div class='wrapperreceive'><span class='receiver'>"+item.from+"</span><p class='receive'>"+util.replaceEmotion(item.content)+"</p></div>";
                }else{
                    html+="<div class='wrappersend'><p class='send'>"+util.replaceEmotion(item.content)+"</p><span class='sender'>"+item.from+"</span></div>";
                }

            });
            return html;
        },
        //给搜索结果添加事件监听
        showSearchPanelClick:function(){
            var oSearchUl=document.getElementById('search_ul');
            var oLiArr=util.makeDomArray(oSearchUl.getElementsByTagName('li'));
            var isTouch=util.isTouchScreen(oSearchUl);
            var that=this;
            for (var i = 0, len = oLiArr.length; i < len; i++) {
                util.addClass(oLiArr[i],'search_li_show');
                if(isTouch){
                    oLiArr[i].ontouchstart = function () {
                        that.closeSearchPanel();
                        that.showTalkPanelClick(this.innerText);
                    }
                }else{
                    oLiArr[i].onclick = function () {
                        that.closeSearchPanel();
                        that.showTalkPanelClick(this.innerText);
                    }
                }

            }
        },
        showSearchPanel:function(){
            var oChatPanel = document.getElementById('chat_panel');
            var oTalkPanel = document.getElementById('talk_panel');
            var oSearchPanel=document.getElementById('search_panel');
            var oWidth = document.body.offsetWidth;
            if (oWidth <= 1024) {
                util.addClass(oChatPanel, 'invisible');
                util.addClass(oTalkPanel,'invisible');
            }
            util.removeClass(oSearchPanel, 'invisible');
            util.addClass(oSearchPanel, 'show_talk_panel');
            this.hideUrlBar();
        },
        bindCloseTalkPanel:function(){
            var oCloseBtn=document.getElementById('close_btn');
            var that=this;
            if(util.isTouchScreen(oCloseBtn)){
                oCloseBtn.ontouchstart=that.closeTalkPanel;
            }else{
                oCloseBtn.onclick=that.closeTalkPanel;
            }
        },
        closeTalkPanel: function () {
            var oChatPanel = document.getElementById('chat_panel');
            var oTalkPanel = document.getElementById('talk_panel');
            var oContent=document.querySelector('#talk_footer input[type=text]');
            var oUl=document.getElementById('face_ul');
            oContent.value="";
            if(!util.hasClass(oUl,'hidden')){
                window.toggleFaceRegion();
            }
            util.addClass(oTalkPanel, 'invisible');
            util.removeClass(oChatPanel, 'invisible');
            util.addClass(oChatPanel, 'show_chat_panel');
        },
        closeSearchPanel:function(){
            var oChatPanel = document.getElementById('chat_panel');
            var oTalkPanel = document.getElementById('talk_panel');
            var oSearchPanel=document.getElementById('search_panel');
            var oSearchUl=document.getElementById('search_ul');
            var oInput=document.getElementById('search_input');
            oSearchUl.innerHTML="";
            oInput.value="";
            util.addClass(oTalkPanel, 'invisible');
            util.removeClass(oChatPanel, 'invisible');
            util.addClass(oSearchPanel,'invisible');
            util.addClass(oChatPanel, 'show_chat_panel');
        },
        //清除用户form数据
        removeUserinterface:function(id){
         var oForm=document.getElementById(id);
         var inputs=oForm.getElementsByTagName('input');
            for(var i= 0,len=inputs.length;i<len;i++){
                if(/text|password/.test(inputs[i].type)){
                    inputs[i].value="";
                }
            }
        },
        //初始化联系人界面,index=0表示从服务器拉取，index=1表示从缓存中取
        initialUser: function(index){
          var html="",data,userData=[],that=this;
            if(index==0){
                util.sendAjax('post','/getAllUser',"",function(xhr){
                    data=JSON.parse(xhr.responseText);
                    if(data.length){
                        util.each(data,function(item){
                            if(item.name!=util.getCurrentUser()){
                            html+="<li><img src='img/user.png' class='user_logo'/>"+item.name+"<i class='fa fa-angle-right right-arrow'></i></li>";
                            userData.push(item.name);
                            }
                        });
                    }
                    localStorage.setItem('users',JSON.stringify(userData));
                    window.userData=userData;
                    that.appendContent(html);
                });
            }
            else{
                userData=JSON.parse(localStorage.getItem('users'));
                window.userData=userData;
                util.each(userData,function(item){
                    html+="<li><img src='img/user.png' class='user_logo'/>"+item+"<i class='fa fa-angle-right right-arrow'></i></li>";
                });
                this.appendContent(html);
            }
        },
        //如果当前对话选项卡没有关于对该人的对话，则添加一个对话
        addToTalkList:function(username){
         var oDescription=document.querySelector('.description');
         var isTouch=util.isTouchScreen(oDescription);
            //选项卡第一个，当前对话列表
         var oTabChat=document.getElementById('user_panel');
         util.addClass(oDescription,'hidden');
            oTabChat.innerHTML+=(isTouch?
            "<li ontouchstart=showTalkPanelClick('"+username+"')><img src='img/user.png' class='user_logo'/>"+username+"...<i class='fa fa-angle-right right-arrow'></i></li>":
                "<li onclick=showTalkPanelClick('"+username+"')><img src='img/user.png' class='user_logo'/>"+username+"...<i class='fa fa-angle-right right-arrow'></i></li>");
        },
        //根据拼接字符串结果来添加内容
        appendContent:function(html){
            //var user_panel=document.getElementById('user_panel');
            var contacts=document.getElementById('contacts');
            //user_panel.innerHTML=html;
            contacts.innerHTML=html;
            //注册点击事件
            this.showTalkPanel();
        },
        appendSearchContent:function(html){
            var oSearchPanel=document.getElementById('search_ul');
                oSearchPanel.innerHTML=html;
                //注册点击事件和相关处理
                this.showSearchPanelClick();
        },
        //监听用户输入关键字实时显示结果
        bindInputChange:function(){
           var oSearchInput=document.getElementById('search_input');
           var oSearchPanel=document.getElementById('search_ul');
            var that=this;
            oSearchInput.oninput=oSearchInput.onpropertychange=function(){
                var html="";
                if(oSearchInput.value==""){
                    oSearchPanel.innerHTML="";
                    return;
                }
                util.each(userData,function(item){
                    if(item.indexOf(util.strTrim(oSearchInput.value))!=-1){
                        html+="<li class='search_ul_li'><img src='img/user.png' class='user_logo'/>"+item+"<i class='fa fa-angle-right right-arrow'></i></li>";
                    }
                });
                that.appendSearchContent(html);
            };

        },
        //让某元素滚动到底部
        scrollToBottom:function(obj){
            if(obj.scrollHeight){
                obj.scrollTop=obj.scrollHeight-obj.offsetHeight;
            }
        },
        //给第index个标签页添加通知或删除通知method为空表示显示通知，否则删除通知
        toggleTabNoticification:function(index,method){
               var oUl=document.getElementById('item_ul');
               var oLi=oUl.getElementsByTagName('li')[index];
               var oSpanArr=oLi.getElementsByTagName('span');
               var oLastSpan=oSpanArr[oSpanArr.length-1];
            if(method){
                util.addClass(oLastSpan,'hidden');
                util.removeClass(oLastSpan,'item_notify');
            }else{
                util.removeClass(oLastSpan,'hidden');
                util.addClass(oLastSpan,'item_notify');
            }
        },
        bindShowEmotion:function(){
            var oShowBtn=document.getElementById('showEmotion');
            var that=this;
            if(util.isTouchScreen(oShowBtn)){
                oShowBtn.ontouchstart=function(){
                    that.toggleFaceRegion();
                };
            }else{
                oShowBtn.onclick=function(){
                    that.toggleFaceRegion();
                };
            }
        },
        //切换表情显示页
        toggleFaceRegion:function(index){
           var oUl=document.getElementById('face_ul');
           var oFooter=document.getElementById('talk_footer');
            var oTalkContent=document.getElementById('talk_content');
            var oWidth = document.body.offsetWidth;
           if(util.hasClass(oUl,'hidden')){
               //如果传参数，代表的是关闭
               if(index){
                   return;
               }
               //不传参数代表切换
               else{
                   if(oWidth<=1024){
                       oFooter.style.bottom='180px';
                   }else{
                       oTalkContent.style.height='310px';
                   }
                   util.removeClass(oUl,'hidden');
               }

           }else{
               if(oWidth<=1024){
                   oFooter.style.bottom='0px';
               }else{
                   oTalkContent.style.height='490px';
               }
               util.addClass(oUl,'hidden');
           }

        },
        hideUrlBar:function(){
            var doc = window.document;

            // If there's a hash, or addEventListener is undefined, stop here
            if(!window.navigator.standalone && !location.hash && window.addEventListener ){

                //scroll to 1
                window.scrollTo( 0, 1 );
                var scrollTop = 1,
                    getScrollTop = function(){
                        return window.pageYOffset || doc.compatMode === "CSS1Compat" && doc.documentElement.scrollTop || doc.body.scrollTop || 0;
                    },

                //reset to 0 on bodyready, if needed
                    bodycheck = setInterval(function(){
                        if( doc.body ){
                            clearInterval( bodycheck );
                            scrollTop = getScrollTop();
                            window.scrollTo( 0, scrollTop === 1 ? 0 : 1 );
                        }
                    }, 15 );
                window.addEventListener( "load", function(){
                    setTimeout(function(){
                        //at load, if user hasn't scrolled more than 20 or so...
                        if( getScrollTop() < 20 ){
                            //reset to hide addr bar at onload
                            window.scrollTo( 0, scrollTop === 1 ? 0 : 1 );
                        }
                    }, 0);
                }, false );
            }
        }
    };
});
