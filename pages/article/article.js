// pages/article/article.js
var app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        blog: "",
        comment: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getArticleById(options.id);
        //屏幕宽度高度
        this.getscreen();
        // 检测是否存在用户信息
        if (app.globalData.userInfo != null) {
            this.setData({
                userInfo: app.globalData.userInfo
            })
        } else {
            app.getUserInfo()
        }
    },

    //自定义请求方法
    getArticleById: function (id) {
        var that = this;
        wx.request({
            url: 'https://hang.jianyiblog.com/wxposts/' + id,
            header: {
                "Content-Type": "applciation/json"
            },
            method: "GET",
            success: function (res) {
                that.setData({
                    blog: res.data,
                })
            },
            fail: function (err) {
            },//请求失败
            complete: function () {
            }//请求完成后执行的函数
        })
    },

    //留言
    addcomment: function (event) {
        console.info("留言：" + event.detail.value.comment);
        console.info("留言文章id：" + event.currentTarget.dataset.postid);
        wx.request({
            url: 'https://hang.jianyiblog.com/wxposts/' + event.currentTarget.dataset.postid + "/comment",
            header: {
                "Content-Type": "applciation/json",
                "Cookie": wx.getStorageSync("sessionid")
            },
            data: {
                content: event.detail.value.comment
            },
            method: "POST",
            success: function (res) {
                if (res.data.code == 200) {
                    console.info("留言成功");
                    wx.showToast({
                        title: '留言成功',
                        icon: 'success',
                        duration: 3000,
                        success: function () {
                            //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
                            setTimeout(function () {
                                wx.navigateBack();
                            }, 1000)
                        }
                    });
                }
            },
            fail: function (err) {
            },//请求失败
            complete: function () {
            }//请求完成后执行的函数
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