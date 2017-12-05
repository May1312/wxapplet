// pages/webPage.js
const app = getApp()
var util = require('../../utils/util.js');  

Page({
  /**
   * 页面的初始数据
   */
  data: {
    motto: '见微知行+',
    blogs: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.showLoading();
    var that = this;
    //延迟调用，先执行app.js中的请求
    setTimeout(function(){
      that.getdata();
    },2000);
    
    //背景音乐播放
    this.playmusic();
    this.getscreen();
  },
  //自定义请求方法
  getdata: function () {//定义函数名称
    var that = this;   // 这个地方非常重要，重置data{}里数据时候setData方法的this应为以及函数的this, 
    //如果在下方的sucess直接写this就变成了wx.request()的this了
    wx.request({
      url: 'https://hang.jianyiblog.com/wxposts',//请求地址
      header: {//请求头
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "GET",//get为默认方法/POST
      success: function (res) {
        console.log("输出返回数据：" + JSON.stringify(res.data));//res.data相当于ajax里面的data,为后台返回的数据
        that.setData({
          blogs: res.data,
        });
        setTimeout(function () {
          that.checkuser();
        }, 1500);
        that.cancelLoading();
      },
      fail: function (err) { },//请求失败
      complete: function () { }//请求完成后执行的函数
    })
  },
  //遮罩演示
  showLoading: function () {
    wx.showToast({
      title: '玩命加载中',
      icon: 'loading',
      duration: 10000
    });
  },
  //取消遮罩
  cancelLoading: function () {
    wx.hideToast();
  },
  checkuser: function(){
    //获取sessionid
    var sessionid = wx.getStorageSync("sessionid");
    wx.request({
      url: 'https://hang.jianyiblog.com/wxlogin/checkuser',//请求地址
      header: {//请求头
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": sessionid
      },
      method: "GET",//get为默认方法/POST
      success: function (res) {
        console.log("checkuser输出返回数据：" + JSON.stringify(res.data));
        if (res.data.userexist==0){

          setTimeout(function(){
            //第二次请求
            var userInfo = JSON.stringify(app.globalData.userInfo);
            //从本地存储中获取
            var systemInfo = JSON.stringify(wx.getStorageSync("systemInfo"));
            console.info("regist:" + JSON.stringify(userInfo) + " " + JSON.stringify(systemInfo));
            wx.request({
              url: 'https://hang.jianyiblog.com/wxlogin/regist',//请求地址
              header: {//请求头
                "Content-Type": "application/x-www-form-urlencoded",
                "Cookie": sessionid
              },
              data: {
                userInfo: userInfo,
                systemInfo: systemInfo
              },
              method: "POST",//get为默认方法/POST
              success: function (res) {
                console.log("regist输出返回数据：" + JSON.stringify(res.data));
                if (res.data.code == 200) {
                  console.info("注册用户成功");
                } else {
                  console.info("注册失败");
                }

              },
              fail: function (err) { },//请求失败
              complete: function () { }//请求完成后执行的函数
            })
          },1000);
          
        }
      },
      fail: function (err) { },//请求失败
      complete: function () { }//请求完成后执行的函数
    })
  },
  //背景音乐
  playmusic: function(){
    wx.playBackgroundAudio({
      dataUrl: 'http://hellohang.win:82/music/日落大道.mp3',
      title: '日落大道',
      coverImgUrl: 'http://hellohang.win:82/picture/girl-boy.jpg'
    })
  },
  //获取屏幕宽度高度
  getscreen: function(){
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }  
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

   if(this.data.type!=null){
     console.info("发布成功回退执行");
      this.getdata();
   }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    if (this.data.type != null) {
      this.setData({
        type:null
      })
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})