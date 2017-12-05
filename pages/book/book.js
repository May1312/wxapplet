Page({
  data: {

  },
  onLoad: function(e){
    this.getBookById(e.bookid);
  },
  //根据id获取书籍信息
  getBookById: function (id) {
    var that = this;
    wx.request({
      url: 'https://hang.jianyiblog.com/wxbooks/search/' + id,
      header: {
        "Content-Type": "applciation/json"
      },
      method: "GET",
      success: function (res) {
        if (res.data.code==200){
          console.info("书籍详情:" + JSON.stringify(res.data.book));
          that.setData({
            book: res.data.book,
            status: 'success'
          })
        }
        
      },
      fail: function (err) { },//请求失败
      complete: function () { }//请求完成后执行的函数
    })
  },
  read: function (event){
    console.info("书籍地址:" + event.currentTarget.dataset.url);
    this.showLoading();
    var that = this;
    wx.downloadFile({
      url: event.currentTarget.dataset.url,
      success: function (res) {
        console.info("本地文件地址:" + JSON.stringify(res));
        var filePath = res.tempFilePath;
        console.info("本地文件地址:" + filePath);
        wx.openDocument({
          filePath: filePath,
          success: function (res) {
            console.log('打开文档成功:' + JSON.stringify(res))
            that.cancelLoading();
          },
          fail: function (res){
            console.log('打开文档失败:' + JSON.stringify(res))
          },
          complete: function (res){
            console.log('opendocument:' + JSON.stringify(res))
          }
        })
      },
      fail: function (res) {
        that.cancelLoading();
        console.log('下载文档失败:' + JSON.stringify(res));
        wx.showModal({
          title: '(╯^╰)',
          content: '文件太大,无法打开',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定');
              wx.showToast({
                title: '我也很绝望',
                image: '../../images/cock.gif',
                duration: 2000
              });
            } else {
              console.log('用户点击取消')
              wx.showToast({
                title: '我也很绝望',
                image: '../../images/cock.gif',
                duration: 2000
              });
            }
          }
        })
      },
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
  //复制文件下载地址
  copyfile: function (event){
    var url = event.currentTarget.dataset.url;
    wx.setClipboardData({
      data: url,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            console.log("复制成功:"+res.data) // data
            wx.showToast({
              title: '复制成功',
              icon: 'success',
              duration: 2000
            });
          }
        })
      }
    })
  }
});
