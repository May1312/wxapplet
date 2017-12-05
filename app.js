//app.js app注册（全局变量）
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.info("输出res.code:"+res.code);
        //var that = this;
        wx.request({
          url: 'https://hang.jianyiblog.com/wxlogin',//后台请求授权
          data: {//发送给后台的数据
            code: res.code,
          },
          header: {//请求头
            "Content-Type": "applciation/json"
          },
          method: "GET",//get为默认方法/POST
          success: function (res) {
            var a = res.header['set-cookie'].split(";");
            console.log("输出返回sessionid：" + a[0]);
            //存储session-key
            if (res.data.code==200){
              wx.setStorageSync("sessionid", a[0])
            }
          },
          fail: function (err) { },//请求失败
          complete: function () { }//请求完成后执行的函数
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              console.info("输出用户信息："+JSON.stringify(res.userInfo));
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          }),
            wx.getSystemInfo({
              success: function (res) {
                console.log("手机型号："+res.model);    //  手机型号
                console.log("操作系统："+res.system); //  操作系统版本
                //this.globalData.systemInfo = res;
                //本地存储
                wx.setStorageSync("systemInfo", res);
              }
            })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  },
  getUserInfo: function (cb) {
    var that = this;
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      // 调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo;
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      });
    }
  },
})