import request from "../../utils/request";
let timer = null;
// pages/search/search.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent: "",
    hotList: [], //热搜榜数据
    searchContent: "", //用户输入的表单项数据
    searchList: [],
    historyList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取本地历史记录
    this.getSearchHistory();
    //初始化数据
    this.getInitData();
  },
  async getInitData() {
    let placeholderContent = await request({
      url: "/search/default",
    });
    let hotListData = await request({
      url: "/search/hot/detail",
    });
    let index = 0;
    let hotList = hotListData.data.map((item) => {
      item.id = index++;
      return item;
    });
    this.setData({
      placeholderContent: placeholderContent.data.showKeyword,
      hotList,
    });
  },
  //获取本地历史记录方法
  getSearchHistory() {
    let historyList = wx.getStorageSync("searchHistory");
    historyList &&
      this.setData({
        historyList,
      });
  },
  handleInputChange(e) {
    //更新状态数据
    this.setData({
      searchContent: e.detail.value.trim(),
    });
    //发送请求获取关键字相关数据
    //函数节流
    if (!this.data.searchContent) {
      this.setData({
        searchList: [],
      });
      clearTimeout(timer);
      return;
    }
    let { searchContent, historyList } = this.data;
    timer && clearTimeout(timer);
    timer = setTimeout(async () => {
      let searchListData = await request({
        url: "/search",
        data: {
          keywords: searchContent,
          limit: 10,
        },
      });
      console.log(searchListData);
      this.setData({
        searchList: searchListData.result.songs,
      });
      //将搜索历史记录存放到搜索历史记录中
      if (historyList.indexOf(searchContent) !== -1) {
        historyList.splice(historyList.indexOf(searchContent), 1);
      }
      historyList.unshift(searchContent);
      this.setData({
        historyList,
      });
      wx.setStorageSync("searchHistory", historyList);
    }, 300);
  },
  //清空搜索内容
  clearSearchInput() {
    this.setData({
      searchContent: "",
      searchList: [],
    });
  },
  //删除历史记录
  deleteSearchHistory() {
    console.log(1);
    wx.showModal({
      content: "确认删除吗？",
      success: (res) => {
        if (res.confirm) {
          //清空data中的history
          this.setData({
            historyList: [],
          });

          //移除本地的历史记录缓存
          wx.removeStorageSync("searchHistory");
        }
      },
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
