define(['utility', 'userinterface','chat'], function (util, ui,chat) {
    return {
        goRegister: function () {
            var oRegisterLink=document.getElementById('register_a');
            var that=this;
            if(util.isTouchScreen(oRegisterLink)){
                oRegisterLink.addEventListener('touchstart',that.doRegisterHandler,false);
            }else{
                oRegisterLink.addEventListener('click',that.doRegisterHandler,false);
            }
        },
        doRegisterHandler:function(){
            var oRegister = document.getElementById('register');
            var oLogin = document.getElementById('login');
            var oHeader = document.getElementById('backHeader');
            util.removeClass(oLogin, 'goback');
            //util.removeClass(oLogin, 'hidden');
            util.removeClass(oRegister, 'hidden');
            util.removeClass(oHeader, 'hidden');
            util.addClass(oRegister, 'goreg');
            util.addClass(oHeader, 'goreg');
            util.addClass(oLogin, 'hidden');
            return false;
        },
        goBack: function () {
            var oHeader = document.getElementById('backHeader');
            var oSpan=oHeader.getElementsByTagName('span')[0];
            var that=this;
            if(util.isTouchScreen(oSpan)){
                oSpan.ontouchstart=that.goBackHandler;
            }else{
                oSpan.onclick=that.goBackHandler;
            }
        },
        goBackHandler:function(){
            var oLogin = document.getElementById('login');
            var oRegister = document.getElementById('register');
            var oHeader = document.getElementById('backHeader');
            util.removeClass(oLogin, 'hidden');
            util.addClass(oLogin, 'goback');
            util.removeClass(oRegister, 'goreg');
            util.addClass(oRegister,'hidden');
            util.removeClass(oHeader, 'goreg');
            util.addClass(oHeader,'hidden');
            ui.removeUserinterface('registerForm');
        },
        register: function () {
            var oBtn = document.getElementById('registerBtn');
            var that=this;
            if(util.isTouchScreen(oBtn)){
                oBtn.ontouchstart =that.registerHandler;
            }else{
                oBtn.onclick=that.registerHandler;
            }
        },
        registerHandler:function () {
            var oMessage = document.getElementById('registermessage');
            var oName = document.getElementById('uname_re');
            var oPass = document.getElementById('passwd_re');
            var oConfirmPass = document.getElementById('passwd_confirm');
            var reg = /^\s*$/ig;
            if (oPass.value != oConfirmPass.value) {
                util.showMessage(oMessage, '两次密码不一致', 'error_show');
            }
            else if (reg.test(oName.value) || reg.test(oPass.value)) {
                util.showMessage(oMessage, '用户名或者密码不能为空', 'error_show');
            }
            else {
                var user = {
                    username: oName.value,
                    password: oPass.value
                };
                util.sendAjax('post', '/reg', user,doRegister);
            }

            return false;
        },
        doRegister: function (xhr) {
            var oMessage = document.getElementById('registermessage');
            if (xhr.responseText == 'user exists') {
                util.showMessage(oMessage, '用户名已存在', 'error_show');
            }
            else if (xhr.responseText == 'fail') {
                util.showMessage(oMessage, '注册失败', 'error_show');
            }
            else {
                localStorage.setItem('currentUser', xhr.responseText);
                ui.initialUserPanel();
                ui.initialUser(0);
                //登陆成功后连接服务器
                chat.connection(util.getCurrentUser());
            }
        }
    };
});
