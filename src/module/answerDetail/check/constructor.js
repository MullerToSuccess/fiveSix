/* eslint-disable */
export const Factory = function (base, core) {
  /* 名称: 手绘板
 */
  var me = this;
  me.width = 0;
  me.height = 0;
  me.divwidth = 0;
  me.divheight = 0;
  me.scale = 1;
  me.orgscale = 1;
  me.funcnum = 3;
  me.linewidth = 2;
  me.color = "#ff1a1a";
  me.mimgflag = 0;//图片处理标记
  me.savestr = [];
  me.Param = {};
  me.handleImgs = [];
  me.response = {};
  me.originPath = {};

  me.$elConavas = null; // 操作的convas标签
  me.$elOriginImg = document.getElementById("phorgimg"); // 原图img标签
  /** 向前进入模块(本模块按自己的设计执行动画)
   */
  this.open = function (param, succ) {
    // console.log(param.num);
    me.Param = param = param || {};
    param.returnfun = param.returnfun || function () {
    };
    /*格式化相对地址*/
    Object.entries(param.images).forEach(([k, {orgimg, img}], i) => {
      me.savestr[i] = "";
      if (!orgimg.match(/(http)|(base64)/))
        param.images[i].orgimg = me.Param.env + param.images[i].orgimg;
      if (!img.match(/(http)|(base64)/))
        param.images[i].img = me.Param.env + param.images[i].img;
      Object.assign(me.originPath, {[k]: orgimg})
    });
    me.initbase64();
    me.addEvent();
    succ && succ();
    return me
  };
  /** 关闭，流程回退(本模块按自己的设计执行动画,动画完成后回调)
   */
  this.close = function (prepage_restore, callback) {
    if (me.savestr.length) {
      me.Param.returnfun(me.savestr);
    }
    prepage_restore();
    $('#qa_painthand').remove();
    callback && callback();
  };
  //确定按钮
  this.on_close = function () {
    __PROJ__.app.go_back();
  };
  //保存成功后
  this.saveSuccess = function (url) {
    me.savestr[me.Param.num] = url;
    // me.on_close();
  };
  //保存图片
  this.on_save = function () {

    me.mergeResponse();
    return me.response
  };
  //初始化得到base64解决跨域
  this.initbase64 = function () {
    let t = null;
    me.mimgflag = 1;
    if (t = me.response[me.Param.num]) {
      me.handleImgs = {
        img: 'data:image/png;base64,' + t.newImg.content,
        orgimg: t.original.content && ('data:image/png;base64,' + t.original.content) || t.original.path,
      }
    } else {
      me.handleImgs = me.Param.images[me.Param.num];
    }
    me.Param.$_update('imgIdx', me.Param.num);
    if (me.handleImgs.orgimg.indexOf("base64,") >= 0) {
      if (me.handleImgs.img.indexOf("base64,") >= 0) {
        me.initpainthand();
        return;
      } else {
        //编辑图转换base64
        $.ajax({
          type: 'get',
          url: me.Param.env + '/api_dist/html2canvasProxy.php?url=' + me.handleImgs.img,
          async: false,
          data: '',
          dataType: 'jsonp',
          success: function (result) {
            //paintimg.src = result;
            me.handleImgs.img = result;
            //console.log(result)
            me.initpainthand();
          },
          error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log('请求出错了!');
          }
        });
      }
    } else {
      //原图转换base64
      $.ajax({
        type: 'get',
        url: me.Param.env + '/api_dist/html2canvasProxy.php?url=' + me.handleImgs.orgimg,
        async: false,
        data: '',
        dataType: 'jsonp',
        success: function (result) {
          //paintimg.src = result;
          me.handleImgs.orgimg = result;
          if (me.handleImgs.img.indexOf("base64,") >= 0) {
            me.initpainthand();
            return;
          } else {
            //编辑图转换base64
            $.ajax({
              type: 'get',
              url: me.Param.env + '/api_dist/html2canvasProxy.php?url=' + me.handleImgs.img,
              async: false,
              data: '',
              dataType: 'jsonp',
              success: function (result) {
                me.handleImgs.img = result;
                me.initpainthand();
              },
              error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log('请求出错了!');
              }
            });
          }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          console.log('请求出错了!');
        }
      });
    }
  }
  //初始化手写板
  this.initpainthand = function () {
    //
    // var phtitlediv = document.getElementById("phtitlediv");
    // console.log(phtitlediv);
    // phtitlediv.innerHTML = (me.Param.num + 1) + "/" + me.Param.images.length;
    var phorgimg = document.getElementById("phorgimg");
    phorgimg.src = me.handleImgs.orgimg;
    // console.log(me.handleImgs.orgimg);
    // console.log(me.handleImgs.img);
    var pheditimg = document.getElementById("pheditimg");
    pheditimg.src = me.handleImgs.img;

    me.divwidth = window.screen.availWidth;
    me.divheight = window.screen.availHeight * 0.81;
    /*原图加载结束*/
    phorgimg.onload = function () {
      me.width = phorgimg.naturalWidth;
      me.height = phorgimg.naturalHeight;
      if (me.width > 1280) {
        me.height = parseInt(me.height * 1280 / me.width)
        me.width = 1280;
        //原图缩放
        var phturncanvas = document.getElementById('phturncanvas');
        phturncanvas.setAttribute('width', me.width);
        phturncanvas.setAttribute('height', me.height);
        var canvasContext = phturncanvas.getContext('2d');
        canvasContext.drawImage(phorgimg, 0, 0, me.width, me.height);
        me.handleImgs.orgimg = phturncanvas.toDataURL();
        phorgimg.onload = "";
        phorgimg.src = me.handleImgs.orgimg;
      }
    }
    /*新图加载结束*/
    pheditimg.onload = function () {
      me.width = pheditimg.naturalWidth;
      me.height = pheditimg.naturalHeight;
      var scaleflag = 0;
      if (me.width > 1280) {
        scaleflag = 1;
        me.height = parseInt(me.height * 1280 / me.width)
        me.width = 1280;
      }
      var phcanvasdiv = document.getElementById("phcanvasdiv");
      phcanvasdiv.innerHTML = '<div  id="phcanvascalediv" style="display:inline-block;line-height:0px;vertical-align:top;"><canvas id="phcanvas" width="' + me.width + '" height="' + me.height + '"></canvas></div><div style="display:none" id="phzoomdiv" class="phzoomdiv">';
      me.$elConavas = document.getElementById("phcanvas");
      var cxt1 = phcanvas.getContext('2d');
      cxt1.drawImage(pheditimg, 0, 0, me.width, me.height);

      me.initscale();

      me.changemargin();

      me.init_phzoomdiv();
      new me.painthandDraw("phcanvas");

      me.mimgflag = 0;
      pheditimg.onload = "";
      if (scaleflag)
        pheditimg.src = phcanvas.toDataURL();
      if (me.funcnum == 1) {
        var phzoomdiv = document.getElementById("phzoomdiv");
        if (phzoomdiv)
          phzoomdiv.style.display = "inline-block";
      } else {
        var phzoomdiv = document.getElementById("phzoomdiv");
        if (phzoomdiv)
          phzoomdiv.style.display = "none";
      }
    };
  }
  //初始化缩放比率
  this.initscale = function () {

    var imgrate = me.height / me.width;
    var imgdivrate = me.divheight / me.divwidth;

    if (imgrate < imgdivrate)//宽度先充满
    {
      if (me.width > me.divwidth)//图片宽度大于div宽度
      {
        me.scale = me.divwidth / me.width;
      }
      else {
        me.scale = 1;
      }
    }
    else//高度先充满
    {
      if (me.height > me.divheight)//图片高度大于div高度
      {
        me.scale = me.divheight / me.height;
      }
      else {
        me.scale = 1;
      }
    }
    me.orgscale = me.scale;
    var phcanvascalediv = $("#phcanvascalediv");
    if (me.scale < 1) {
      phcanvascalediv.width(me.width * me.scale);
      phcanvascalediv.height(me.height * me.scale);
    } else {
      phcanvascalediv.width(me.width);
      phcanvascalediv.height(me.height);
    }
    phcanvascalediv.css("transform-origin", "0% 0%");
    phcanvascalediv.css("transform", "scale(" + me.scale + ")");

    var phzoomdiv = $("#phzoomdiv");
    var phcanvasdiv = $("#phcanvasdiv");
    if (me.width * me.scale > phcanvasdiv.width())
      phzoomdiv.width(me.width * me.scale);
    else
      phzoomdiv.width(phcanvasdiv.width());

    if (me.height * me.scale > phcanvasdiv.height())
      phzoomdiv.height(me.height * me.scale);
    else
      phzoomdiv.height(phcanvasdiv.height())
  }
  //修改margin
  this.changemargin = function () {
    var phcanvascalediv = document.getElementById("phcanvascalediv");
    if (me.divwidth > me.width * me.scale)
      phcanvascalediv.style.marginLeft = (me.divwidth - me.width * me.scale) / 2 + "px";
    else {
      phcanvascalediv.style.marginLeft = 0;
    }
    if (me.divheight > me.height * me.scale)
      phcanvascalediv.style.marginTop = (me.divheight - me.height * me.scale) / 2 + "px";
    else
      phcanvascalediv.style.marginTop = 0;

  }
  //初始化双指缩放phzoomdiv
  this.init_phzoomdiv = function () {
    //双指缩放图片
    $("#phcanvasdiv").on('touchstart', function (event) {
      var startx = event.originalEvent.targetTouches[0].pageX;
      var starty = event.originalEvent.targetTouches[0].pageY;
      var phzoomdiv = this;
      var phcanvasdiv = document.getElementById("phcanvasdiv");

      if (event.originalEvent.targetTouches.length > 1) {
        var x0 = Math.abs(event.originalEvent.targetTouches[0].pageX - event.originalEvent.targetTouches[1].pageX);
        var y0 = Math.abs(event.originalEvent.targetTouches[0].pageY - event.originalEvent.targetTouches[1].pageY);

      }

      var phcanvasdiv = document.getElementById("phcanvasdiv"),
        scrollWidth = phcanvasdiv.scrollWidth,
        scrollHeight = phcanvasdiv.scrollHeight;

      this.ontouchmove = function (event) {
        if (event.targetTouches.length > 1) {
          startx = event.targetTouches[0].pageX;
          starty = event.targetTouches[0].pageY;
          var x1 = Math.abs(event.targetTouches[0].pageX - event.targetTouches[1].pageX);
          var y1 = Math.abs(event.targetTouches[0].pageY - event.targetTouches[1].pageY);
          var mx = (event.targetTouches[0].pageX + event.targetTouches[1].pageX) / 2;
          var my = (event.targetTouches[0].pageY + event.targetTouches[1].pageY) / 2;
          //$("#phtitlediv").html("mx:"+mx+",my"+my)
          var x2 = Math.abs(x1 - x0);
          var y2 = Math.abs(y1 - y0);
          if (x2 > 40) {
            if (x1 > x0) {
              me.imagezoomin(mx, my);
              x0 = x1;
              y0 = y1;
            } else {
              me.imagezoomout(mx, my);
              x0 = x1;
              y0 = y1;
            }
          }
          if (y2 > 40) {
            if (y1 > y0) {
              me.imagezoomin(mx, my);
              x0 = x1;
              y0 = y1;
            } else {
              me.imagezoomout(mx, my);
              x0 = x1;
              y0 = y1;
            }
          }
        } else {
          //$("#phtitlediv").html("w1:"+$("#phzoomdiv").height()+",w2:"+$("#phcanvasdiv").height())
          //$("#phtitlediv").html("w1:"+phcanvasdiv.scrollHeight+",w2:"+me.divheight);
          if ((scrollWidth <= (me.divwidth + 1)) && (scrollHeight <= (me.divheight + 3))) {
            var endx = event.targetTouches[0].pageX;
            // console.log(startx , endx);
            if ((startx - endx) > 120) {
              me.nextimage();
              phzoomdiv.ontouchmove = phzoomdiv.ontouchend = null;
              return;
            }
            if ((endx - startx) > 120) {
              me.lastimage();
              phzoomdiv.ontouchmove = phzoomdiv.ontouchend = null;
              return;
            }
          } else {
            phcanvasdiv.scrollLeft = phcanvasdiv.scrollLeft - (event.targetTouches[0].pageX - startx);
            phcanvasdiv.scrollTop = phcanvasdiv.scrollTop - (event.targetTouches[0].pageY - starty);
            startx = event.targetTouches[0].pageX;
            starty = event.targetTouches[0].pageY;

            var maxleft = $("#phzoomdiv").width() - $("#phcanvasdiv").width();
            if (phcanvasdiv.scrollLeft > maxleft)
              phcanvasdiv.scrollLeft = maxleft;
            var maxtop = $("#phzoomdiv").height() - $("#phcanvasdiv").height();
            if (phcanvasdiv.scrollTop > maxtop)
              phcanvasdiv.scrollTop = maxtop;

            //$("#phtitlediv").html("w1:"+$("#phcanvasdiv").width()+",w2:"+$("#phzoomdiv").width()+",w3:"+phcanvasdiv.scrollLeft)
          }
        }
      }
      this.ontouchend = function () {
        phzoomdiv.ontouchmove = phzoomdiv.ontouchend = null;
      }
      event.preventDefault();
      event.stopPropagation();
    });
    //鼠标滚轮缩放图片
    $("#phzoomdiv").on("DOMMouseScroll", function (event) {
      if (event.originalEvent.detail > 0)
        me.imagezoomout(event.originalEvent.layerX, event.originalEvent.layerY);
      else
        me.imagezoomin(event.originalEvent.layerX, event.originalEvent.layerY);
      event.preventDefault();
      event.stopPropagation();
    });
    //鼠标拖动图片
    $("#phzoomdiv").on('mousedown', function (event) {
      var phzoomdiv = this;
      var phcanvasdiv = document.getElementById("phcanvasdiv");
      var startx = event.clientX;
      var starty = event.clientY;
      this.onmousemove = function (event) {
        var phcanvasdiv = document.getElementById("phcanvasdiv");

        if ((phcanvasdiv.scrollWidth <= (me.divwidth + 1)) && (phcanvasdiv.scrollHeight <= (me.divheight + 1))) {
          var endx = event.clientX;
          if ((startx - endx) > 120) {
            me.nextimage();
            phzoomdiv.onmousemove = phzoomdiv.onmouseup = null;
            return;
          }
          if ((endx - startx) > 120) {
            me.lastimage();
            phzoomdiv.onmousemove = phzoomdiv.onmouseup = null;
            return;
          }
        } else {
          phcanvasdiv.scrollLeft = phcanvasdiv.scrollLeft - (event.clientX - startx);
          phcanvasdiv.scrollTop = phcanvasdiv.scrollTop - (event.clientY - starty);
          startx = event.clientX;
          starty = event.clientY;
        }
      }
      this.onmouseout = function () {
        phzoomdiv.onmousemove = phzoomdiv.onmouseup = null;
      }
      this.onmouseup = function () {
        phzoomdiv.onmousemove = phzoomdiv.onmouseup = null;
      }
    });
  }
  /*add event*/
  this.addEvent = function () {
    var phcanvasdiv = $('#phcanvasdiv');
    //双指缩放图片
    phcanvasdiv.on('touchstart', function (event) {
      if (event.originalEvent.targetTouches.length > 1) {
        var startx = event.originalEvent.targetTouches[0].pageX;
        var starty = event.originalEvent.targetTouches[0].pageY;
        var x0 = Math.abs(event.originalEvent.targetTouches[0].pageX - event.originalEvent.targetTouches[1].pageX);
        var y0 = Math.abs(event.originalEvent.targetTouches[0].pageY - event.originalEvent.targetTouches[1].pageY);

        this.ontouchmove = function (event) {
          startx = event.targetTouches[0].pageX;
          starty = event.targetTouches[0].pageY;
          var x1 = Math.abs(event.targetTouches[0].pageX - event.targetTouches[1].pageX);
          var y1 = Math.abs(event.targetTouches[0].pageY - event.targetTouches[1].pageY);
          var mx = (event.targetTouches[0].pageX + event.targetTouches[1].pageX) / 2;
          var my = (event.targetTouches[0].pageY + event.targetTouches[1].pageY) / 2;
          //$("#phtitlediv").html("mx:"+mx+",my"+my)
          var x2 = Math.abs(x1 - x0);
          var y2 = Math.abs(y1 - y0);
          if (x2 > 40) {
            if (x1 > x0) {
              me.imagezoomin(mx, my);
              x0 = x1;
              y0 = y1;
            } else {
              me.imagezoomout(mx, my);
              x0 = x1;
              y0 = y1;
            }
          }
          if (y2 > 40) {
            if (y1 > y0) {
              me.imagezoomin(mx, my);
              x0 = x1;
              y0 = y1;
            } else {
              me.imagezoomout(mx, my);
              x0 = x1;
              y0 = y1;
            }
          }
        }
        this.ontouchend = function () {
          phcanvasdiv.ontouchmove = phcanvasdiv.ontouchend = null;
        }
      }
      event.preventDefault();
      event.stopPropagation();
    });
  },
    //切换画笔
  this.on_pen = function (state) {
      // __PROJ__.app.index.writeBigDataLog({"id": '00107002'});//	埋点
      if (state) {
        me.funcnum = 1;
        var phzoomdiv = document.getElementById("phzoomdiv");
        if (phzoomdiv)
          phzoomdiv.style.display = "inline-block";
      } else {
        me.funcnum = 3;
        var phzoomdiv = document.getElementById("phzoomdiv");
        if (phzoomdiv)
          phzoomdiv.style.display = "none";
      }
      me.on_closecolor();
    }
  //清空
  this.on_clear = function (close) {

    var phcanvas = document.getElementById("phcanvas");
    var ctx = phcanvas.getContext('2d');
    var phorgimg = document.getElementById("phorgimg");
    ctx.drawImage(phorgimg, 0, 0, me.width, me.height);
    close && close();
  }
  //擦除
  this.on_erase = function (state) {
    // __PROJ__.app.index.writeBigDataLog({"id": '00107005'});//	埋点
    var phzoomdiv = document.getElementById("phzoomdiv");
    if (!phzoomdiv)
      return;
    me.on_closecolor();
    if (state) {
      // divthis.className = "phtbndiv";
      me.funcnum = 1;
      var phzoomdiv = document.getElementById("phzoomdiv");
      if (phzoomdiv)
        phzoomdiv.style.display = "inline-block";
    } else {
      // $("div.phtbndiv").removeClass("click");
      // divthis.className = "phtbndiv click";
      me.funcnum = 5;
      var phzoomdiv = document.getElementById("phzoomdiv");
      if (phzoomdiv.style.display == "inline-block")
        phzoomdiv.style.display = "none";
    }

  }
  //旋转
  this.on_turn = function (callback) {
    //console.log(phcanvas.toDataURL());
    // __PROJ__.app.index.writeBigDataLog({"id": '00107003'});//	埋点
    if (me.mimgflag == 1) {
      return;
    }
    if (me.originPath[me.Param.num].indexOf("base64,") >= 0) {
      callback('文字手绘旋转无效!');
      return;
    }
    var flag = 0;
    me.mimgflag = 1;

    //旋转当前编辑图
    var phcanvas = document.getElementById('phcanvas');
    var phturncanvas = document.getElementById('phturncanvas');
    var canvasContext = phturncanvas.getContext('2d');
    if (flag == 90) {
      phturncanvas.setAttribute('width', me.height);
      phturncanvas.setAttribute('height', me.width);
      canvasContext.rotate(90 * Math.PI / 180);
      canvasContext.drawImage(phcanvas, 0, -me.height);
    }
    else {
      phturncanvas.setAttribute('width', me.height);
      phturncanvas.setAttribute('height', me.width);
      canvasContext.rotate(270 * Math.PI / 180);
      canvasContext.drawImage(phcanvas, -me.width, 0);
    }
    phcanvas.setAttribute('width', me.height);
    phcanvas.setAttribute('height', me.width);
    var ctx = phcanvas.getContext('2d');
    ctx.drawImage(phturncanvas, 0, 0);
    //旋转canvas后需要恢复线条宽度和颜色
    ctx.lineWidth = me.linewidth;
    ctx.strokeStyle = me.color;

    //旋转原图
    var phorgimg = document.getElementById("phorgimg");
    if (flag == 90) {
      //canvasContext.rotate(90 * Math.PI / 180);
      canvasContext.drawImage(phorgimg, 0, -me.height);
    }
    else {
      //canvasContext.rotate(270 * Math.PI / 180);
      canvasContext.drawImage(phorgimg, -me.width, 0);
    }
    phorgimg.src = phturncanvas.toDataURL();
    phorgimg.onload = function () {
      //旋转结束 初始化变量
      [me.width, me.height] = [me.height, me.width];
      me.initscale();
      me.changemargin();
      me.mimgflag = 0;
      phorgimg.onload = "";
    }
  }
  //颜色
  this.on_color = function () {
    // __PROJ__.app.index.writeBigDataLog({"id": '00107004'});//	埋点
    var phzoomdiv = document.getElementById("phzoomdiv");
    if (!phzoomdiv) return;

    var phcolordiv = document.getElementById("phcolordiv");
    if (phcolordiv.style.display == "none")
      phcolordiv.style.display = "inline-block";
    me.funcnum = 3;
    var phzoomdiv = document.getElementById("phzoomdiv");
    if (phzoomdiv.style.display == "inline-block")
      phzoomdiv.style.display = "none";
  }
  //关闭颜色线条div
  this.on_closecolor = function (divthis) {
    var phcolordiv = document.getElementById("phcolordiv");
    if (phcolordiv.style.display == "inline-block") {
      phcolordiv.style.display = "none";
      $("div.phtbndiv").removeClass("click");
      $("div.phtlinediv").parent().addClass("click");
    }
  }
  //选择线条粗细
  this.on_selwidth = function (linewidth, divthis) {
    var phcanvas = document.getElementById('phcanvas');
    if (phcanvas == null)
      return;
    var context = phcanvas.getContext('2d');
    context.lineWidth = linewidth;
    me.linewidth = linewidth;
  }
  //选择画笔颜色
  this.on_selcolor = function (color) {
    var phcanvas = document.getElementById('phcanvas');
    if (phcanvas == null)
      return;
    var context = phcanvas.getContext('2d');
    context.strokeStyle = color;
    me.color = color;
  }
  //下一张
  this.nextimage = function (divthis) {
    // __PROJ__.app.index.writeBigDataLog({"id": '00107006'});//	埋点

    if (me.mimgflag == 1) {
      return;
    }
    if (!me.Param.images[me.Param.num + 1]) {
      me.Param.$toast('已经是最后一个啦!');
      return;
    }
    me.mergeResponse();
    me.Param.num++;
    var phcanvasdiv = document.getElementById("phcanvasdiv");
    phcanvasdiv.className = "phcanvasdiv slide out";
    setTimeout(function () {
      phcanvasdiv.innerHTML = '<div style="text-align:center;">加载中...</div>';
      phcanvasdiv.className = "phcanvasdiv slide in";
      me.initbase64();
    }, 125);
    //console.log(phcanvas.toDataURL());
  }
  //上一张
  this.lastimage = function (divthis) {
    // __PROJ__.app.index.writeBigDataLog({"id": '00107006'});//	埋点
    if (me.mimgflag == 1) {
      return;
    }
    if (!me.Param.images[me.Param.num - 1]) {
      me.Param.$toast('前面没有啦!');
      return;
    }
    me.mergeResponse();
    me.Param.num--;
    var phcanvasdiv = document.getElementById("phcanvasdiv");
    phcanvasdiv.className = "phcanvasdiv slide reverse out";
    setTimeout(function () {
      phcanvasdiv.innerHTML = '<div style="text-align:center;">加载中...</div>';
      phcanvasdiv.className = "phcanvasdiv slide reverse in";
      me.initbase64();
    }, 125);

    //console.log(phcanvas.toDataURL());
  }
  //放大
  this.imagezoomin = function (x, y) {
    if (me.scale > 2)
      return;

    var phcanvascalediv = $("#phcanvascalediv");
    me.scale = me.scale * 1.2;
    if (me.scale < 1) {
      phcanvascalediv.width(me.width * me.scale);
      phcanvascalediv.height(me.height * me.scale);
    } else {
      phcanvascalediv.width(me.width);
      phcanvascalediv.height(me.height);
    }
    var phzoomdiv = $("#phzoomdiv");
    var phcanvasdiv = $("#phcanvasdiv");

    if (me.width * me.scale > phcanvasdiv.width())
      phzoomdiv.width(me.width * me.scale);
    else
      phzoomdiv.width(phcanvasdiv.width());

    if (me.height * me.scale > phcanvasdiv.height())
      phzoomdiv.height(me.height * me.scale);
    else
      phzoomdiv.height(phcanvasdiv.height())

    phcanvascalediv.css("transform-origin", "0% 0%");
    phcanvascalediv.css("transform", "scale(" + me.scale + ")");

    var phcanvasdiv = document.getElementById("phcanvasdiv");
    phcanvasdiv.scrollLeft = x * 0.2 + phcanvasdiv.scrollLeft * 1.2;
    phcanvasdiv.scrollTop = y * 0.2 + phcanvasdiv.scrollTop * 1.2;

    var maxleft = $("#phzoomdiv").width() - $("#phcanvasdiv").width();
    if (phcanvasdiv.scrollLeft > maxleft)
      phcanvasdiv.scrollLeft = maxleft;
    var maxtop = $("#phzoomdiv").height() - $("#phcanvasdiv").height();
    if (phcanvasdiv.scrollTop > maxtop)
      phcanvasdiv.scrollTop = maxtop;

    me.changemargin();
    //$("#phtitlediv").html("w1:"+$("#phcanvasdiv").width()+",w2:"+phzoomdiv.width()+",w3:"+phcanvasdiv.scrollLeft)
  }
  //缩小
  this.imagezoomout = function (x, y) {
    if (me.orgscale > me.scale / 1.2)
      return;
    var phcanvascalediv = $("#phcanvascalediv");
    var phzoomdiv = $("#phzoomdiv");
    me.scale = me.scale / 1.2;
    if (me.scale < 1) {
      phcanvascalediv.width(me.width * me.scale);
      phcanvascalediv.height(me.height * me.scale);
    } else {
      phcanvascalediv.width(me.width);
      phcanvascalediv.height(me.height);
    }

    var phzoomdiv = $("#phzoomdiv");
    var phcanvasdiv = $("#phcanvasdiv");

    if (me.width * me.scale > phcanvasdiv.width())
      phzoomdiv.width(me.width * me.scale);
    else
      phzoomdiv.width(phcanvasdiv.width());
    if (me.height * me.scale > phcanvasdiv.height())
      phzoomdiv.height(me.height * me.scale);
    else
      phzoomdiv.height(phcanvasdiv.height());

    phcanvascalediv.css("transform-origin", "0% 0%");
    phcanvascalediv.css("transform", "scale(" + me.scale + ")");

    var phcanvasdiv = document.getElementById("phcanvasdiv");

    phcanvasdiv.scrollLeft = phcanvasdiv.scrollLeft / 1.2 - x * (0.2 / 1.2);
    phcanvasdiv.scrollTop = phcanvasdiv.scrollTop / 1.2 - y * (0.2 / 1.2);

    var maxleft = $("#phzoomdiv").width() - $("#phcanvasdiv").width();
    if (phcanvasdiv.scrollLeft > maxleft)
      phcanvasdiv.scrollLeft = maxleft;
    var maxtop = $("#phzoomdiv").height() - $("#phcanvasdiv").height();
    if (phcanvasdiv.scrollTop > maxtop)
      phcanvasdiv.scrollTop = maxtop;

    me.changemargin();
    //$("#phtitlediv").html("w1:"+$("#phcanvasdiv").width()+",w2:"+phzoomdiv.width()+",w3:"+phcanvasdiv.scrollLeft)
  }
  //手绘板画笔
  this.painthandDraw = function (arg) {
    var pthis = this;
    pthis.startx = 0;
    pthis.starty = 0;

    pthis.img = document.getElementById("phorgimg");

    if (arg.nodeType) {
      this.canvas = arg;
    } else if (typeof arg == 'string') {

      this.canvas = document.getElementById(arg);
      if (this.canvas == null) {
        return;
      }
    } else {
      return;
    }
    this.clearall = function () {

      this.context.beginPath();
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.stroke();
    };
    this.init = function () {
      var that = this;
      if (!this.canvas.getContext) {
        return;
      }

      var event = window.event || arguments.callee.caller.arguments[0];
      this.context = this.canvas.getContext('2d');

      this.context.lineWidth = me.linewidth;
      this.context.strokeStyle = me.color;

      this.canvas.onselectstart = function () {
        return false;  //修复chrome下光标样式的问题
      };

      if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone/i)) {
        this.canvas.ontouchstart = function (event) {
          event.preventDefault();
          event.stopPropagation();
          if (event.targetTouches.length > 1) return;
          that.drawBegin(event);
        };
      }
      else {

        this.canvas.onmousedown = function (event) {
          event.stopPropagation();
          that.drawBegin(event);
        };
      }

    };
    this.drawBegin = function (e) {
      var that = this;
      var paintx;
      var painty;

      me.Param.drawBegin();
      var phcolordiv = document.getElementById("phcolordiv");
      if (phcolordiv.style.display == "inline-block") {
        phcolordiv.style.display = "none";
      }

      let stage_info = this.canvas.getBoundingClientRect();
      window.getSelection ? window.getSelection().removeAllRanges() :
        document.selection.empty();  //清除文本的选中
      this.context.beginPath();

      this.context.lineCap = "round";
      this.context.lineJoin = "round";

      //console.log(this.context.strokeStyle)
      //if(navigator.userAgent.match(/Mobile/i))

      //if(this.context.strokeStyle == "#ffffff")

      if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone/i)) {
        paintx = e.changedTouches[0].clientX - stage_info.left;
        painty = e.changedTouches[0].clientY - stage_info.top;

        paintx = paintx / me.scale;
        painty = painty / me.scale;

        if (me.funcnum == 5) {
          this.context.drawImage(pthis.img, paintx, painty, 20, 20, paintx, painty, 20, 20);
        } else {
          this.context.moveTo(
            paintx,
            painty
          );
        }

        this.canvas.ontouchmove = function (event) {
          event.stopPropagation();
          event.preventDefault();
          if (event.targetTouches.length > 1) return;
          that.drawing(event);
        }
        this.canvas.ontouchend = this.drawEnd;
      }
      else {
        paintx = e.clientX - stage_info.left;
        painty = e.clientY - stage_info.top;

        paintx = paintx / me.scale;
        painty = painty / me.scale;

        if (me.funcnum == 5) {
          this.context.drawImage(pthis.img, paintx - 10, painty - 10, 20, 20, paintx - 10, painty - 10, 20, 20);
        } else {
          this.context.moveTo(
            paintx,
            painty
          );
        }

        this.canvas.onmousemove = function (event) {
          event.stopPropagation();
          that.drawing(event);
        }
        this.canvas.onmouseup = this.drawEnd;
      }

      pthis.startx = paintx;
      pthis.starty = painty;

    };
    this.drawing = function (e) {
      var stage_info = this.canvas.getBoundingClientRect();
      var paintx;
      var painty;
      //if(navigator.userAgent.match(/Mobile/i))

      this.context.beginPath();
      if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone/i)) {
        e.preventDefault();
        paintx = e.changedTouches[0].clientX - stage_info.left;
        painty = e.changedTouches[0].clientY - stage_info.top;
      }
      else {
        e.preventDefault();

        paintx = e.clientX - stage_info.left;
        painty = e.clientY - stage_info.top;
      }


      //console.log(canvas.getScaleFactor())
      paintx = paintx / me.scale;
      painty = painty / me.scale;

      //if(this.context.strokeStyle == "#ffffff")

      if (me.funcnum == 5) {
        if (paintx < 10)
          paintx = 10;
        if (painty < 10)
          painty = 10;
        this.context.drawImage(pthis.img, paintx - 10, painty - 10, 20, 20, paintx - 10, painty - 10, 20, 20);
        /*this.context.clearRect(
            paintx-10,
            painty-10, 20, 20
        );*/
      }
      if (me.funcnum == 3) {
        this.context.moveTo(pthis.startx, pthis.starty);
        //console.log(paintx)
        //任意线
        this.context.lineTo(
          paintx,
          painty
        );
        pthis.startx = paintx;
        pthis.starty = painty;
        this.context.stroke();
      }
    };
    this.drawEnd = function () {
      //if(navigator.userAgent.match(/Mobile/i))
      if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone/i)) {
        pthis.canvas.ontouchmove = pthis.canvas.ontouchend = null;
      }
      else {
        pthis.canvas.onmousemove = pthis.canvas.onmouseup = null;
      }
    };
    this.init();
  };

  //保存当前修改后的图片
  this.mergeResponse = function () {
    let {response, Param, originPath, $elConavas, $elOriginImg} = me,
      oPath = originPath[Param.num];
    Object.assign(response, {
      [Param.num]: {
        newImg: {
          request: 'saveAsImage',
          content: $elConavas.toDataURL().substr(22),
        },
        original: {
          request: 'replaceImage',
          content: (oPath.indexOf(";base64,") == -1) && $elOriginImg.src.substr(22) || 'none',
          path: oPath,
        }
      }
    });
  };


}
