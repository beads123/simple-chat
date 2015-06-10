define(function(){
    return {
        bind:function(obj,evtArgs){

            obj.ontouchstart=function(e){
                console.log('start');
                e.preventDefault();
                this.startX=e.targetTouches[0].pageX;
                this.startY=e.targetTouches[0].pageY;
                //console.dir(this);
            };
            obj.ontouchmove=function(e){
                e.preventDefault();
                if(e.targetTouches.length>1|| e.scale && e.scale !== 1){
                    return;
                }
                this.endX= e.targetTouches[0].pageX;
                this.endY= e.targetTouches[0].pageY;
            };
            obj.ontouchend=function(e){
                if(Math.abs(this.endX-this.startX)>Math.abs(this.endY-this.startY)){
                    if(this.endX-this.startX>50){
                        if(evtArgs['swiperight']){
                            evtArgs['swiperight']();
                        }

                    }else if(this.endX-this.startX<-50){
                        if(evtArgs['swipeleft']){
                            evtArgs['swipeleft']();
                        }
                    }
                    if(this.endY-this.startY>50){
                        if(evtArgs['swipedown']){
                            evtArgs['swipedown']();
                        }
                    }else if(this.endY-this.startY<-50){
                        if(evtArgs['swipeup']){
                            evtArgs['swipeup']();
                        }
                    }
                }
            }
        }
    }
});
