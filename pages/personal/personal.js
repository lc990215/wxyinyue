let startY = 0; // 手指起始坐标
let moveY = 0; // 手指移动的坐标
let moveDistance = 0; //手指移动的距离
import request from "../../utils/request";
// pages/personal/personal.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    coverTransform: "translateY(0)",
    coverTransition: "",
    userInfo: {},
    recentPlayList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //读取用户基本信息
    let userInfo = wx.getStorageSync("userInfo");
    if (userInfo) {
      userInfo = JSON.parse(wx.getStorageSync("userInfo"))
      this.setData({
        userInfo:userInfo,
      });
      //获取用户播放记录
      this.getUserRecentPlayList(userInfo.userId);
    }
  },

  //获取用户播放记录的功能函数
  async getUserRecentPlayList(userId) {
    let recentPlayListData = await request({
      url: "/user/record",
      data: {
        uid: userId,
        type: 0,
      },
    });
    let index = 0;
    let recentPlayList = recentPlayListData.allData.splice(0,10).map(item=>{
        item.id = index++;
        return item;
    })
    this.setData({
      recentPlayList
    });
  },
  handleTouchStart(e) {
    this.setData({
      coverTransition: "",
    });
    startY = e.touches[0].clientY; //获取手指的起始坐标
  },
  handleTouchMove(e) {
    moveY = e.touches[0].clientY; //获取手指的移动坐标
    moveDistance = moveY - startY; ////获取手指的移动距离
    if (moveDistance <= 0) {
      return;
    }
    if (moveDistance >= 80) {
      moveDistance = 80;
    }
    this.setData({
      coverTransform: `translateY(${moveDistance}rpx)`,
    });
  },
  handleTouchEnd() {
    this.setData({
      coverTransform: "translateY(0)",
      coverTransition: "transform 1s linear",
    });
  },
  //跳转至Login页面的回调
  toLogin() {
    wx.navigateTo({
      url: "/pages/login/login",
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
