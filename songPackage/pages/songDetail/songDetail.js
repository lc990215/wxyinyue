import request from "../../../utils/request";
import pubSub from "pubsub-js";
import moment from "moment";
const appInstance = getApp();
// pages/songDetail/songDetail.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false, //音乐是否播放
    song: {}, //歌曲详情对象
    musicId: "",
    musicLink: "",
    currentTime: "00:00", //实时时间
    durationTime: "00:00", //总时长
    currentWidth: 0, //实时进度条宽度
    currentMusicId: "", //实时播放的musicId
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    appInstance.globalData.musicId &&
      this.setData({
        currentMusicId: appInstance.globalData.musicId,
      });
    let musicId = options.musicId;
    //判断是否是当前页面的音乐在播放
    if (
      appInstance.globalData.isMusicPlay &&
      appInstance.globalData.musicId === musicId
    ) {
      //修改当前页面音乐播放状态为true
      this.setData({
        isPlay: true,
      });
    }
    this.getMusicInfo(musicId);
    this.setData({
      musicId,
    });
    //创建音乐控制实例到小程序实例身上
    this.backgroundAudioManager = wx.getBackgroundAudioManager();
    //监听音乐播放暂停
    this.backgroundAudioManager.onPlay(() => {
      appInstance.globalData.musicId = this.data.musicId.toString();
      this.setData({
        currentMusicId: this.data.musicId.toString(),
      });
      this.changePlayStatus(true);
    });
    this.backgroundAudioManager.onPause(() => {
      this.changePlayStatus(false);
    });
    //监听背景音频停止事件
    this.backgroundAudioManager.onStop(() => {
      this.changePlayStatus(false);
    });
    //监听音乐实时播放的进度
    this.backgroundAudioManager.onTimeUpdate(() => {
      //格式化实时播放事件
      let currentTime = moment(
        this.backgroundAudioManager.currentTime * 1000
      ).format("mm:ss");
      //实时进度条长度
      let currentWidth =
        (this.backgroundAudioManager.currentTime /
          this.backgroundAudioManager.duration) *
        450;
      this.setData({
        currentTime,
        currentWidth,
      });
    });
    //歌曲自然结束
    this.backgroundAudioManager.onEnded(() => {
      //关闭当前音乐
      this.backgroundAudioManager.stop();
      pubSub.publish("switchType", "next");
      //订阅来自recommendSong发布的musicId信息
      pubSub.subscribe("musicId", (msg, musicId) => {
        this.setData({
          musicId:musicId.toString(),
        });
        this.setData({
          currentMusicId: musicId.toString(),
        });
        appInstance.globalData.musicId = musicId.toString();
        //获取最新的音乐信息
        this.getMusicInfo(musicId);
        //自动播放最新的音乐
        this.musicControl(true, musicId);
        pubSub.unsubscribe("musicId");
      });
      //将实时进度条变为0.时间还原变成0
      // this.setData({
      //   currentWidth: 0,
      //   currentTime: "00:00",
      // });
    });
  },
  //修改播放状态功能函数
  changePlayStatus(isPlay) {
    this.setData({
      isPlay,
    });
    //修改全局变量中music的播放状态
    appInstance.globalData.isMusicPlay = isPlay;
  },
  //点击播放暂停回调
  handleMusicPlay() {
    let isPlay = !this.data.isPlay;
    //修改是否播放状态
    // this.setData({
    //   isPlay,
    // });
    let { musicId, musicLink } = this.data;
    this.musicControl(isPlay, musicId, musicLink);
  },
  //获取音乐详情
  async getMusicInfo(musicId) {
    let songData = await request({
      url: "/song/detail",
      data: {
        ids: musicId,
      },
    });
    //获取总时长ms
    let durationTime = moment(songData.songs[0].dt).format("mm:ss");
    this.setData({
      song: songData.songs[0],
      durationTime,
    });
    //动态修改窗口标题
    wx.setNavigationBarTitle({
      title: this.data.song.name,
    });
  },
  //获取音乐url
  //控制音乐播放暂停功能
  async musicControl(isPlay, musicId, musicLink) {
    if (isPlay) {
      if (!musicLink) {
        let musicLinkData = await request({
          url: "/song/url",
          data: {
            id: musicId,
          },
        });
        musicLink = musicLinkData.data[0].url;
        this.setData({
          musicLink,
        });
      }
      //音乐播放
      this.backgroundAudioManager.title = this.data.song.name;
      this.backgroundAudioManager.src = musicLink;
    } else {
      //音乐暂停
      this.backgroundAudioManager.pause();
    }
  },
  //点击切换歌曲的回调
  handleSwitch(e) {
    let type = e.currentTarget.id;
    //停止当前的音乐
    this.backgroundAudioManager.stop();
    //发送音乐切换的类型
    pubSub.publish("switchType", type);
    //订阅来自recommendSong发布的musicId信息
    pubSub.subscribe("musicId", (msg, musicId) => {
      //获取音乐信息
      this.setData({
        currentMusicId: musicId.toString(),
        musicId: musicId.toString(),
      });
      appInstance.globalData.musicId = musicId.toString();
      this.getMusicInfo(musicId);
      this.musicControl(true, musicId);
      this.changePlayStatus(true);
      pubSub.unsubscribe("musicId");
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
