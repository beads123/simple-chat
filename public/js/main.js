




require(['userinterface','loginout','register','chat'],function(ui,log,register,chat){
    window.onload=function(){
        ui.hideUrlBar();
        window.orientation=function(){
           ui.hideUrlBar();
        };
        this.doRegister=register.doRegister;
        this.goBack=register.goBack;
        this.setTabItem=ui.setTabItem;
        this.closeTalkPanel=ui.closeTalkPanel;
        this.showSearchPanel=ui.showSearchPanel;
        this.closeSearchPanel=ui.closeSearchPanel;
        this.showTalkPanel=ui.showTalkPanel;
        this.showTabNoticification=ui.showTabNoticification;
        this.toggleFaceRegion=ui.toggleFaceRegion;
        this.replaceEmotion=chat.replaceEmotion;
        this.showTalkPanelClick=ui.showTalkPanelClick;
        this.readTalkHistory=ui.readTalkHistory;
        this.sendMessage=chat.sendMessage;
        this.scrollToBottom=ui.scrollToBottom;
        this.hideUrlBar=ui.hideUrlBar;
        this.doLogin=log.doLogin;
        this.reveiveMessage=chat.reveiveMessage;
        this.toggleTabNoticification=ui.toggleTabNoticification;
        this.toggleFaceRegion=ui.toggleFaceRegion;
        //导航到注册页面
        register.goRegister();
        //注册界面事件监听
        register.register();
        //注册返回事件
        register.goBack();
        //注册用户登录事件
        log.login();
        //用户是否登录
        log.checkCurrentUser();
        //用户退出事件监听
        log.logout();
        //用户搜索关键字事件监听
        ui.bindInputChange();
        //绑定标签页切换事件
        ui.bindItemClick();
        //绑定关闭搜索框事件
        ui.bindSearchClose();
        //关闭对话框
        ui.bindCloseTalkPanel();
        //切换表情显示页
        ui.bindShowEmotion();
        //切换选项卡滑动事件
        ui.bindItemSwipe();
        //点击选择表情事件
        chat.bindEmotionClick();
        //点击发送事件
        chat.bindSendMessage();
    };


});




