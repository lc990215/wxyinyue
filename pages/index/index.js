import request from "../../utils/request";
// pages/index/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    bannersList: [],
    recommendList: [],
    topList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let result = await request({
      url: "/banner",
      data: {
        type: 2,
      },
    });
    this.setData({
      bannersList: result.banners,
    });

    //获取推荐歌单数据
    let recommendListData = await request({
      url: "/personalized",
      data: {
        limit: 10,
      },
    });
    this.setData({
      recommendList: recommendListData.result,
    });

    let index = 0;
    let resultArr = [];
    class TopItem {
      constructor(itemInfo) {
        (this.name = itemInfo.playlist.name),
          (this.tracks = itemInfo.playlist.tracks.slice(0, 3));
      }
    }
    while (index != 5) {
      let topListData = await request({
        url: "/top/list",
        data: {
          idx: index++,
        },
      });
      let topListItem = new TopItem(topListData);
      resultArr.push(topListItem);
      this.setData({
        topList: resultArr,
      });
    }
  },
  toRecommend(){
    wx.navigateTo({
      url:'/songPackage/pages/recommendSong/recommendSong'
    })
  },
  toOther(){
    wx.navigateTo({
      url:'/pages/other/other'
    })
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
