// pages/success/success.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  //跳转主页
  toindex: function(){
   /** wx.navigateBack({
      delta: 2
    })**/
    wx.navigateTo({
      url: "../index/index"
    });
  }
})