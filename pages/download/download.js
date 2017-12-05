// pages/download/download.js
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
    this.download(options.url);
  },
  download: function (url) {
    var that = this;
    const downloadTask = wx.downloadFile({
      url: url,
      success: function (res) {
        console.info("文件临时地址:" + JSON.stringify(res));
        wx.saveFile({
          tempFilePath: res.tempFilePath,
          success: function (res) {
            var savedFilePath = res.savedFilePath;
            console.info("以保存的本地文件:" + savedFilePath);
            wx.showToast({
              title: '下载完成',
              icon: 'success',
              duration: 3000,
              success: function () {
                setTimeout(function(){
                  wx.navigateBack({
                    delta: 2
                  })
                },1000);
              }
            })
          }
        })
      },
      fail: function (res) {
        console.log('下载文档失败:' + JSON.stringify(res));
        wx.showModal({
          title: '(╯^╰)',
          content: '文件太大,无法下载',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定');
              wx.showToast({
                title: '我也很绝望',
                image: '../../images/cock.gif',
                duration: 2000
              });
              setTimeout(function () {
                wx.navigateBack({
                  delta: 2
                })
              }, 2000);
            } else {
              console.log('用户点击取消')
              wx.showToast({
                title: '我也很绝望',
                image: '../../images/cock.gif',
                duration: 2000
              });
              setTimeout(function(){
                wx.navigateBack({
                  delta: 2
                })
              },2000);
            }
          }
        })
      },
    })

    downloadTask.onProgressUpdate((res) => {
      console.log('下载进度', res.progress)
      setTimeout(function(){
        that.progress(res.progress);
      },20);
      console.log('已经下载的数据长度', res.totalBytesWritten)
      console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)
    })
  },
  progress: function (progress) {
    this.setData({
      progress: progress,
    });
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
  
  }
})