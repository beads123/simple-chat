define(['utility', 'userinterface','chat'], function (util, ui,chat) {
    return{
        login: function () {
            var oLogin = document.getElementById('loginBtn');
            var that=this;
            if(util.isTouchScreen(oLogin)){
                oLogin.ontouchstart =that.loginHandler;
            }else{
                oLogin.onclick=that.loginHandler;
            }
        },
        loginHandler:function () {
            var oName = document.getElementById('username');
            var oPass = document.getElementById('password');
            var oMessage = document.getElementById('loginmessage');
            var reg = /^\s*$/ig;
            if (reg.test(oName.value) || reg.test(oPass.value)) {
                util.showMessage(oMessage, '登陆用户名密码不能为空', 'error_show');
            }
            else {
                var user = {
                    username: oName.value,
                    password: oPass.value
                };
                util.sendAjax('post', '/login', user, doLogin);
            }
        },
        doLogin: function (xhr) {
            var oMessage = document.getElementById('loginmessage');
            if (xhr.responseText == 'no user') {
                util.showMessage(oMessage, '用户名不存在', 'error_show');
            }
            else if (xhr.responseText == 'fail') {
                util.showMessage(oMessage, '登陆失败', 'error_show');
            }
            else if (xhr.responseText == 'invalid password') {
                util.showMessage(oMessage, '密码错误', 'error_show');
            }
            else
            {
                localStorage.setItem('currentUser', xhr.responseText);
                ui.initialUserPanel();
                ui.initialUser(0);
                //登陆成功后连接服务器
                chat.connection(util.getCurrentUser());
            }
        },
        checkCurrentUser: function () {
            var user = localStorage.getItem('currentUser');
            if (user) {
                ui.initialUserPanel();
                ui.initialUser(1);
                //登陆成功后连接服务器
                chat.connection(util.getCurrentUser());
            }
        },
       logout: function () {
        var oLogoutBtn=document.getElementById('logoutbtn');
        var that=this;
        if(util.isTouchScreen(oLogoutBtn)){
            oLogoutBtn.ontouchstart=function(){
                if(window.confirm("确定退出当前用户？")){
                    that.doLogout();
                    location.reload();
                }
            };
        }else{
            oLogoutBtn.onclick=function(){
                if(window.confirm("确定退出当前用户？")){
                    that.doLogout();
                    location.reload();
                }
            };
        }

      },
    doLogout:function(){
        var oLogin=document.getElementById('login');
        var oRegister=document.getElementById('register');
        var oUserDiv=document.getElementById('user_div');
        //var user={username:util.getCurrentUser()};
        //修改登录状态为退出
        //util.sendAjax('post','/logout',user);
        util.removeClass(oLogin,'hidden');
        util.removeClass(oRegister,'hidden');
        util.addClass(oUserDiv,'hidden');
        //退出的时候清除所有缓存
        util.clearUserDataCache();

    }
    };
});
