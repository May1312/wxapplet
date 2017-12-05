//获取应用实例
var app = getApp();
// 注册当页全局变量，存放搜索结果以便更新到data中
var curBooksList = [];
Page({
  data: {
    cancel: false,
    inputValue: null,
    focus: false,
    //整合部分
    booksList: [],
    keyword: null,
    pageCurrent: null,
    pagesTotal: null,
    scrollHeight: null,//滚动区域高度
    cancel: true,  //是否显示输入框清除按钮
    dropLoadFunc: "dropLoad"
  },
//搜索框表单提交
  formSubmit: function (e) {
    var that = this;
    var keyword = null;
    if (e.detail.value.book) {
      keyword = e.detail.value.book;
      that.search(keyword);
    } else {
      wx.showToast({
        title: '您没有输入哦',
        icon: 'success',
        duration: 10000
      })
      setTimeout(function () {
        wx.hideToast()
      }, 1000)
      return false;
    }
  },
//input框校验输入
  enterSubmit: function (e) {
    var that = this;
    var keyword = null;
    if (e.detail.value) {
      keyword = e.detail.value;
      that.search(keyword);
    } else {
      wx.showToast({
        title: '您没有输入哦',
        icon: 'success',
        duration: 10000
      })
      setTimeout(function () {
        wx.hideToast()
      }, 1000)
      return false;
    }
  },

  search: function (keyword) {
    console.info("搜索条件:" + keyword);
    var that = this;
    wx.showToast({
      title: '搜索中',
      icon: 'loading',
      duration: 10000
    });
    var url;
    if (keyword){
      url = 'https://hang.jianyiblog.com/wxbooks/search?page=1&rows=4&bookname=' + keyword
    }else{
      url = 'https://hang.jianyiblog.com/wxbooks/search?page=1&rows=4'
    }
    wx.request({
      url: url,
      success: function (res) {
        wx.hideToast()
        var result = res.data;
        console.info("返回搜索结果:" + JSON.stringify(result.booksList));
        //更新当前页
        that.setData({
          booksList: result.booksList,
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
  getbooks: function () {
    var that = this;
    wx.request({
      url: 'https://hang.jianyiblog.com/wxbooks/search?page=1&rows=4',
      success: function (res) {
        wx.hideToast()
        app.globalData.searchResult = res.data;

        var result = app.globalData.searchResult
        curBooksList = result.booksList
        // 有搜索结果
        if (result.code == 200) {
          console.info("返回的books数据：" + JSON.stringify(result));
          // 更新数据
          that.setData({
            status: "success",
            booksList: result.booksList,
            pageCurrent: result.pageCurrent,
            pagesTotal: result.pagesTotal
          })
        } else {
          // 无搜索结果
          that.setData({
            status: "fail",
          })
        }
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

  //input清除按钮显示
  typeIng: function (e) {
    var that = this;
    if (e.detail.value) {
      that.setData({
        cancel: true
      })
    } else {
      that.setData({
        cancel: false
      })
    }
  },
  //清除输入框
  clearInput: function () {
    console.log(1)
    this.setData({
      inputValue: null,
      cancel: false,
      focus: true
    })
  },

//整合部分
  // 页面初始化
  onLoad: function (param) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight - (104 * res.windowWidth / 750),//窗口高度(px)-搜索模块高度(px)
        })
      }
    })
    that.setData({
      keyword: param.keyword,
    })
    wx.showToast({
      title: '拼命加载中',
      icon: 'loading',
      duration: 10000
    })
    setTimeout(function () {
      that.getbooks();
    }, 2000);
    //屏幕宽高度
    that.getscreen();
  },
  //搜索按钮事件
  formSubmit: function (e) {
    var that = this;
    var keyword = null;
    if (e.detail.value.book) {
      keyword = e.detail.value.book;
      that.search(keyword);
    } else {
      console.info("查询所有");
      that.search();
    }
  },
  //回车事件
  enterSubmit: function (e) {
    var that = this;
    var keyword = null;
    if (e.detail.value) {
      keyword = e.detail.value;
      that.search(keyword);
    } else {
      wx.showToast({
        title: '怎么可以为空！！',
        image: '../../images/cock.gif',
        duration: 10000
      })
      setTimeout(function () {
        wx.hideToast()
      }, 1000)
      return false;
    }
  },

  // 上拉加载
  dropLoad: function () {

    var that = this;
    if (this.data.pageCurrent < this.data.pagesTotal) {
      //锁定上拉加载
      that.setData({
        dropLoadFunc: null
      })
      that.loadMore();
    }
  },

  //加载更多
  loadMore: function () {

    var that = this;
    var page = parseInt(that.data.pageCurrent) + 1;

    wx.request({
      url: 'https://hang.jianyiblog.com/wxbooks/search?page=' + page + '&rows=4',
      success: function (res) {

        if (res.data.code == 200) {
          // 更新数据
          curBooksList = curBooksList.concat(res.data.booksList);
          console.info("更新书籍列表:"+JSON.stringify(curBooksList));
          that.setData({
            booksList: curBooksList,
            pageCurrent: res.data.pageCurrent
          })
        } else {
          // 无搜索结果
          console.log("没有结果")
        }
      },
      complete: function () {
        //启动上拉加载
        that.setData({
          dropLoadFunc: "dropLoad"
        })
      }
    })
  },
  //input清除按钮显示
  typeIng: function (e) {
    var that = this;
    if (e.detail.value) {
      that.setData({
        cancel: true
      })
    } else {
      that.setData({
        cancel: false
      })
    }
  },
  //清除输入框
  clearInput: function () {
    this.setData({
      keyword: null,
      cancel: false,
      focus: true
    })
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
})
