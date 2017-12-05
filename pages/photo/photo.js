// pages/photo/photo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },
  //获取屏幕宽度高度
  getscreen: function () {
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
//获取photoes数据
getPhotoes: function(){
  var that = this;
  wx.showToast({
    title: '拼命加载中',
    icon: 'loading',
    duration: 10000
  });
  wx.request({
    url: "https://hang.jianyiblog.com/wxphoto/search?page=1&rows=30",
    success: function (res) {
      wx.hideToast()
      var result = res.data;
      console.info("返回搜索结果:" + JSON.stringify(result.photoesList));
      //更新当前页
      that.setData({
        photoesList: result.photoesList,
      })
    },
    fail: function () {
      wx.showToast({
        title: '连接失败',
        icon: 'success',
        duration: 5000
      })
      setTimeout(function () {
        wx.hideToast()
      }, 2000)
    },
    complete: function () {

    }
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getscreen();
    this.getPhotoes();
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
    if (this.data.type != null) {
      console.info("上传成功回退执行");
      this.getPhotoes();
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
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
  
  },
  show: function(e){
    wx.previewImage({
      current: e.currentTarget.dataset.url, // 当前显示图片的http链接
      urls: [e.currentTarget.dataset.url] // 需要预览的图片http链接列表
    })
  }
})