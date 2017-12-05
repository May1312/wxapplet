// upload的核心代码
var uploadFn = require('../../utils/upload.js')
//地图
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;

//获取应用实例
var app = getApp()
Page({
  data: {
    files: []
  },
  //上传按钮事件处理函数
  uploadToCos: function () {
    var that = this;
    // 选择上传的图片
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        //that.setData({
        //  files: that.data.files.concat(res.tempFilePaths)
        //});
        wx.showToast({
          title: '正在上传',
          image: '../../images/cock.gif',
          duration: 10000
        })
        // 获取文件路径
        var filePath = res.tempFilePaths[0];
        console.info("选中的文件:"+res.tempFilePaths);
        var suffix = /\.[^\.]+$/.exec(filePath);
        console.info("文件后缀:" + suffix);
        // 获取文件名
        var timestamp = (new Date()).valueOf(); 
        var fileName = timestamp + suffix;
            qqmapsdk.reverseGeocoder({
              //location: {
              //  latitude: latitude,
               // longitude: longitude
              //},
              success: function (addressRes) {
                var address = addressRes.result.formatted_addresses.recommend;
                console.info("当前地址:"+address);
                that.getUpload(filePath,fileName,address);
                },
              fail: function (res) {
                console.log(res);
                that.getUpload(filePath, fileName, "");
              },
             })
      }
    })
  },
  // 文件上传cos，参考上面的核心代码
  getUpload: function (filePath, fileName,address){
    uploadFn(filePath, fileName, function (result) {
      console.info("图片cos地址:" + result);
      if (result) {
        wx.request({
          url: 'https://hang.jianyiblog.com/wxphoto/upload',
          header: {
            "Content-Type": "applciation/json",
            "Cookie": wx.getStorageSync("sessionid")
          },
          method: "POST",
          data: {
            address: address,
            url: result
          },
          success: function (res) {
            if (res.data.code==200){
              console.info("成功");
              
              var pages = getCurrentPages();
              var prevPage = pages[pages.length - 2];  //上一个页面

              //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
              setTimeout(function () {
                //var blogs = that.getdata();
                prevPage.setData({
                  type: "uploaded"
                });
                setTimeout(function () {
                  wx.hideToast();
                  wx.navigateBack();
                }, 1000)
              }, 500)
            }
          },
          fail: function (err) { 
            wx.showToast({
              title: '上传异常',
              image: '../../images/cock.gif',
              duration: 10000
            });
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 1000);
          },//请求失败
          complete: function () {
  
           }//请求完成后执行的函数
        })
      }
    });
  },
  
  onLoad: function (cb) {
    var that = this
    // 检测是否存在用户信息
    if (app.globalData.userInfo != null) {
      console.info("上传页面用户信息初始化");
      that.setData({
        userInfo: app.globalData.userInfo
      })
    } else {
      console.info("上传页面用户信息初始化");
      app.getUserInfo();
    }
    typeof cb == 'function' && cb();

    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'IWXBZ-WSY6O-DEKW2-SK6JA-ERGBF-CGFDJ'
    });
  },
})