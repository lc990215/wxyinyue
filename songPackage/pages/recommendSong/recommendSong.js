import request from "../../../utils/request";
import pubSub from "pubsub-js";
// pages/recommendSong/recommendSong.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    day: "",
    month: "",
    recommendList: [],
    index: 0, //点击音乐的下表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //判断用户是否登录
    let userInfo = wx.getStorageSync("userInfo");
    if (!userInfo) {
      wx.showToast({
        title: "请先登录",
        icon: "none",
        success: () => {
          //跳转至登录界面
          wx.reLaunch({
            url: "/pages/login/login",
          });
        },
      });
    }
    //更新日期
    this.setData({
      day: new Date().getDate(),
      month: new Date().getMonth() + 1,
    });
    //获取用户每日推荐数据
    this.getRecommendSong();
    //订阅来自songDetail发布的消息
    pubSub.subscribe("switchType", (msg, type) => {
      let { recommendList, index } = this.data;
      if (type === "prev") {
        //上一首
        //如果当前index=0 也就是是第一首歌曲的时候让index等于总歌曲的长度然后再减1就跳转到最后一首
        index === 0 && (index = recommendList.length);
        index -= 1;
      } else {
        //如果当前index是最后一首歌让他等于-1然后+1以后就是第一首歌的index
        index === recommendList.length - 1 && (index = -1);
        //下一首
        index += 1;
      }
      this.setData({
        index,
      });
      let musicId = recommendList[index].id;
      // //将musicId回传给songDetail页面
      pubSub.publish("musicId", musicId);
    });
  },
  //获取每日推荐数据
  async getRecommendSong() {
    let recommendListData = await request({
      url: "/recommend/songs",
    });
    this.setData({
      recommendList: recommendListData.recommend,
    });
  },
  // 跳转详情回调
  toSongDetail(e) {
    let { song, index } = e.currentTarget.dataset;
    this.setData({
      index,
    });
    //路由跳转传参：query
    wx.navigateTo({
      // url: "/pages/songDetail/songDetail?song="+JSON.stringify(song),
      url: "/songPackage/pages/songDetail/songDetail?musicId=" + song.id,
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
