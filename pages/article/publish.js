// pages/article/public.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (cb) {
        // 检测是否存在用户信息
        if (app.globalData.userInfo != null) {
            this.setData({
                userInfo: app.globalData.userInfo
            })
        } else {
            app.getUserInfo()
        }
        typeof cb == 'function' && cb();
        this.getscreen();
    },
//自定义函数
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
    //发布文章
    publish: function (event) {
        console.info("文章标题：" + event.detail.value.title);
        console.info("文章内容：" + event.detail.value.content);
        var that = this;
        wx.request({
            url: 'https://hang.jianyiblog.com/wxposts/publish',
            header: {
                "Content-Type": "applciation/json",
                "Cookie": wx.getStorageSync("sessionid")
            },
            data: {
                title: event.detail.value.title,
                content: event.detail.value.content
            },
            method: "POST",
            success: function (res) {
                if (res.data.code == 200) {
                    console.info("发布成功");
                    wx.showToast({
                        title: '发布成功',
                        icon: 'success',
                        duration: 3000,
                        success: function () {
                            var pages = getCurrentPages();
                            var prevPage = pages[pages.length - 2];  //上一个页面

                            //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
                            setTimeout(function () {
                                //var blogs = that.getdata();
                                prevPage.setData({
                                    type: "publish"
                                });
                                setTimeout(function () {
                                    wx.navigateBack();
                                }, 1000)
                            }, 1500)

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
                return res.data;
            },
            fail: function (err) {
            },//请求失败
            complete: function () {
            }//请求完成后执行的函数
        })
    },
})