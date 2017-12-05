
var app = getApp();
Page({
  data:{
    grid_gallery:{enName:'gallery', zhName:'相册'},
    grid_location:{enName: 'location', zhName: '位置' },
    grid_what:{ enName: 'what', zhName: '鲸鱼'},
  },
  onLoad:function(cb){
    var that = this
    console.log(app.globalData.userInfo)
    // 检测是否存在用户信息
    if (app.globalData.userInfo != null) {
      that.setData({
          userInfo: app.globalData.userInfo
      })
    } else {
      app.getUserInfo()
    }
    typeof cb == 'function' && cb()
  },
  onPullDownRefresh: function() {
    this.onLoad(function(){
      wx.stopPullDownRefresh()
    })
  },
  locate: function(){
    console.info("获取位置");
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          scale: 28
        })
      }
    })
  },
  jingyu:function(){
    wx.showToast({
      title: '等待开拓的世界',
      image: '../../images/jingyu.gif',
      duration: 10000
    });
  }
})