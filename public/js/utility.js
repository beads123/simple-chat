define(function () {
    return {
        addClass: function (obj, cName) {
            var classArr = this.strTrim(obj.className).split(" ");
            var i, flag = false;
            for (i = 0; i < classArr.length; i++) {
                if (classArr[i] == cName) {
                    flag = true;
                }
            }
            obj.className = (flag ? classArr.join(" ") : classArr.concat(cName).join(" "));
        },
        removeClass: function (obj, cName) {
            var classArr = this.strTrim(obj.className).split(" ");
            for (var i = 0; i < classArr.length; i++) {
                if (classArr[i] == cName) {
                    classArr[i] = "";
                }
            }
            obj.className = classArr.join(" ");
        },
        hasClass: function (obj, cName) {
            return obj.className.indexOf(cName) == -1 ? false : true;
        },
        strTrim: function (str) {
            var reg = /^\s+|\s+$/ig;
            return str.replace(reg, "");
        },
        //显示用户信息
        showMessage: function (obj, message, cName) {
            obj.innerText = message;
            this.addClass(obj, cName);
        },
        //移除用户信息
        hideMessage: function (obj, cName) {
            obj.innerText = "";
            this.removeClass(obj, cName);
        },
        sendAjax: function (method, url, data, callback) {
            var xhr;
            if (window.XMLHttpRequest) {
                xhr = new XMLHttpRequest();
            }
            else {
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    callback(xhr);
                }
            };
            xhr.open(method, url, true);
            if (method == 'post') {
                xhr.setRequestHeader('Content-type', "application/x-www-form-urlencoded");
            }
            if (data) {
                xhr.send(this.formatAjaxPostData(data));
            }
            else {
                xhr.send();
            }

        },
        //将jsonObj转化为post字符串
        formatAjaxPostData: function (jsonObj) {
            var str = "";
            for (var key in jsonObj) {
                str += (key + "=" + jsonObj[key] + "&");
            }
            return str.slice(0, str.length - 1);
        },
        isType:function(obj,type){
            return Object.prototype.toString.call(obj)==='[object '+type+']';
        },
        //将htmlElement类数组转化真正的数组
        makeDomArray:function(htmlArr){
          var ret=[];
            for(var i=0;i<htmlArr.length;i++){
                if(htmlArr[i].nodeType==1){
                    ret.push(htmlArr[i]);
                }
            }
            return ret;
        },
        //遍历数组执行回调函数
        each:function(arr,callback){
             if(this.isType(arr,'Array')){
                 for(var i=0;i<arr.length;i++){
                     callback(arr[i]);
                 }
             }
        },
        getCurrentUser:function(){
            return localStorage.getItem('currentUser')?JSON.parse(localStorage.getItem('currentUser')).name:"";
        },
        //在显示之前处理表情，将其替换为对图片的引用,同时去掉随机生成的时间字符串
        replaceEmotion:function(htmlStr){
            htmlStr= htmlStr.replace(/\[/g,"<i class=' face face-").replace(/\]/g,"'></i>");
            var index=htmlStr.lastIndexOf("*");
            if(index!=-1){
                return htmlStr.substring(0,index);
            }
           return htmlStr;
        },
        //删除用户相关的本地存储
        clearUserDataCache:function(){
            var users=JSON.parse(localStorage.getItem('users'));
            this.each(users,function(user){
                localStorage.removeItem(user);
            });
            localStorage.removeItem('currentUser');
            localStorage.removeItem('users');

        },
        isTouchScreen:function(obj){
            if( "ontouchstart" in window || "ontouchstart" in document){
                return true;
            }else{
                return false;
            }
        }
    };
});
