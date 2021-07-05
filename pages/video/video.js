let isChange = false;
import request from "../../utils/request";
// pages/video/video.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [],
    navId: "", //导航标识,
    videoList: [],
    videoId: "", //视频id标识
    videoUpdateTime: [], //记录video播放时间
    isTriggered: false, //标识下拉刷新是否已经触发
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    this.getVideoGroupListData();
  },
  //获取导航数据
  async getVideoGroupListData() {
    let videoGroupListData = await request({
      url: "/video/group/list",
    });
    this.setData({
      videoGroupList: videoGroupListData.data.slice(0, 14),
      navId: videoGroupListData.data[0].id,
    });
    //获取视频列表数据
    this.getVideoList(this.data.navId);
  },
  //点击切换导航
  changeNav(e) {
    isChange = true;
    this.videoContext && this.videoContext.pause();
    let navId = e.currentTarget.id;
    this.setData({
      navId: navId >>> 0,
      videoList: [],
    });
    //显示正在加载
    wx.showLoading({
      title: "正在加载",
    });
    this.getVideoList(this.data.navId);
  },
  //获取视频列表数据
  async getVideoList(navId) {
    if (!navId) {
      return;
    }
    let res = await request({
      url: "/video/group",
      data: {
        id: navId,
      },
    });
    if (res.code === 301) {
      return;
    }
    //关闭消息提示框
    wx.hideLoading();
    let index = 0;
    let videoList = res.datas.map((item) => {
      item.id = index++;
      return item;
    });
    this.setData({
      videoList,
      isTriggered: false, //关闭下拉刷新
    });
  },
  //点击播放/继续播放的回调
  handlePlay(e) {
    let vid = e.currentTarget.id;
    //关闭上一个视频的实例
    // this.vid !== vid && this.videoContext && this.videoContext.stop();
    //创建video控制的实例
    this.videoContext = wx.createVideoContext(vid);
    //判断之前视频是否有之前的播放记录 如果有 跳转至指定播放位置
    let { videoUpdateTime } = this.data;
    let videoItem = videoUpdateTime.find((item) => item.vid === vid);
    if (videoItem) {
      this.videoContext.seek(videoItem.currentTime);
    }
    if (!isChange) {
      this.videoContext.play();
    }
  },
  handleImage(e) {
    isChange = false;
    //保存点击图片相对应的视频的vid
    this.setData({
      videoId: e.currentTarget.id,
    });
  },
  //监听视频播放的回调
  handleTimeUpdate(e) {
    let videoTimeObj = {
      vid: e.currentTarget.id,
      currentTime: e.detail.currentTime,
    };
    let { videoUpdateTime } = this.data;
    //判断播放时长的videoUpdateTime数组中是否有相同的视频如果有的话就只更改他的currentTime
    let videoItem = videoUpdateTime.find(
      (item) => item.vid === videoTimeObj.vid
    );
    //如果有相同视频就更改他的currentTime
    if (videoItem) {
      videoItem.currentTime = videoTimeObj.currentTime;
    }
    //不然的话就将新的视频push进数组中
    else {
      videoUpdateTime.push(videoTimeObj);
    }
    //更新数组
    this.setData({
      videoUpdateTime,
    });
  },
  //监听视频播放结束的回调
  handleVideoEnd(e) {
    let { videoUpdateTime } = this.data;
    videoUpdateTime.splice(
      videoUpdateTime.findIndex((item) => item.vid === e.currentTarget.id),
      1
    );
    this.setData({
      videoUpdateTime,
    });
  },
  //自定义下拉刷新的回调
  handleRefresher() {
    //发请求获取新的视频列表数据
    this.getVideoList(this.data.navId);
  },
  //自定义下拉触底的回调
  handleToLower() {
    let newVideoList = [
      {
        type: 1,
        displayed: false,
        alg: "onlineHotGroup",
        extAlg: null,
        data: {
          alg: "onlineHotGroup",
          scm: "1.music-video-timeline.video_timeline.video.181017.-295043608",
          threadId: "R_VI_62_8C9C0E472D38CBF8816951711CEF2965",
          coverUrl:
            "https://p2.music.126.net/_RK-cytclqt3ckp9xU5TrQ==/109951163574180649.jpg",
          height: 720,
          width: 1280,
          title: "邓紫棋《新的心跳》超燃现场，这装扮真的很大胆了！",
          description: "邓紫棋《新的心跳》超燃现场，这装扮真的很大胆了！",
          commentCount: 531,
          shareCount: 401,
          resolutions: [
            {
              resolution: 240,
              size: 22597797,
            },
            {
              resolution: 480,
              size: 38202250,
            },
            {
              resolution: 720,
              size: 50465197,
            },
          ],
          creator: {
            defaultAvatar: false,
            province: 1000000,
            authStatus: 0,
            followed: false,
            avatarUrl:
              "http://p1.music.126.net/VPGeeVnQ0jLp4hK9kj0EPg==/18897306347016806.jpg",
            accountStatus: 0,
            gender: 0,
            city: 1002400,
            birthday: -2209017600000,
            userId: 449979212,
            userType: 202,
            nickname: "全球潮音乐",
            signature: "有时候音乐是陪我熬过那些夜晚的唯一朋友。",
            description: "",
            detailDescription: "",
            avatarImgId: 18897306347016810,
            backgroundImgId: 18987466300481468,
            backgroundUrl:
              "http://p1.music.126.net/qx6U5-1LCeMT9t7RLV7r1A==/18987466300481468.jpg",
            authority: 0,
            mutual: false,
            expertTags: null,
            experts: {
              1: "音乐视频达人",
              2: "华语音乐|欧美音乐资讯达人",
            },
            djStatus: 0,
            vipType: 0,
            remarkName: null,
            avatarImgIdStr: "18897306347016806",
            backgroundImgIdStr: "18987466300481468",
          },
          urlInfo: {
            id: "8C9C0E472D38CBF8816951711CEF2965",
            url: "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/GvvhvIQj_1886447358_shd.mp4?ts=1624601396&rid=DCD0CB091AB82F68AC95437FC74CFB5B&rl=3&rs=AFQIzUXRPmXsfUvPaTWSGMVKmHgdMmAr&sign=668f30207f0154e9e6117570f88cf42f&ext=rua%2FxTcjfvTEiY%2B5HghoX8l%2FMhLiv%2F2ELsF56Vr9aEhe8vjRmFrVOQLUQPxVqbnWNQzlDDuE8EhqwEjttCZpjLX1WRIM6pB7262hiiyN427zXWYFTWGGUkb4fQxT%2FA4b0fK%2F%2BlyLDDWBQCiLV7Ow5UNn7LGkppqTxeOUslIL1EBLr%2FCoWU7JdH5brBe6wHKju1Dkd1%2FBykV8VLmTpzlvK%2BsXElApdlTwb%2FZHOCd1tEh0%2Beg%2FYZeZTZ%2FPzE%2Fcun9K",
            size: 50465197,
            validityTime: 1200,
            needPay: false,
            payInfo: null,
            r: 720,
          },
          videoGroup: [
            {
              id: 58100,
              name: "现场",
              alg: null,
            },
            {
              id: 59101,
              name: "华语现场",
              alg: null,
            },
            {
              id: 57108,
              name: "流行现场",
              alg: null,
            },
            {
              id: 59108,
              name: "巡演现场",
              alg: null,
            },
            {
              id: 1100,
              name: "音乐现场",
              alg: null,
            },
            {
              id: 5100,
              name: "音乐",
              alg: null,
            },
          ],
          previewUrl: null,
          previewDurationms: 0,
          hasRelatedGameAd: false,
          markTypes: null,
          relateSong: [],
          relatedInfo: null,
          videoUserLiveInfo: null,
          vid: "8C9C0E472D38CBF8816951711CEF2965",
          durationms: 146960,
          playTime: 1356157,
          praisedCount: 4330,
          praised: false,
          subscribed: false,
        },
      },
      {
        type: 1,
        displayed: false,
        alg: "onlineHotGroup",
        extAlg: null,
        data: {
          alg: "onlineHotGroup",
          scm: "1.music-video-timeline.video_timeline.video.181017.-295043608",
          threadId: "R_VI_62_75B27820714F0E08B5C06DB854D48C2B",
          coverUrl:
            "https://p1.music.126.net/xAVhgIMWQvHmzsrfYcMp-Q==/109951163709997818.jpg",
          height: 1080,
          width: 1920,
          title: "林俊杰翻唱《崇拜》，林俊杰真的是原唱杀手！",
          description:
            "林俊杰翻唱《崇拜》，林俊杰真的是原唱杀手！梁静茹唱的是无奈，林俊杰唱的是洒脱",
          commentCount: 1031,
          shareCount: 5790,
          resolutions: [
            {
              resolution: 240,
              size: 36008829,
            },
            {
              resolution: 480,
              size: 97004508,
            },
            {
              resolution: 720,
              size: 145327588,
            },
            {
              resolution: 1080,
              size: 228246683,
            },
          ],
          creator: {
            defaultAvatar: false,
            province: 350000,
            authStatus: 0,
            followed: false,
            avatarUrl:
              "http://p1.music.126.net/BqaqjmfOOP0nRhil3M2y1A==/19041342370266626.jpg",
            accountStatus: 0,
            gender: 2,
            city: 350100,
            birthday: -2209017600000,
            userId: 1287906511,
            userType: 202,
            nickname: "音乐奇葩君",
            signature: "合作联系weiqipa",
            description: "",
            detailDescription: "",
            avatarImgId: 19041342370266624,
            backgroundImgId: 109951162868126480,
            backgroundUrl:
              "http://p1.music.126.net/_f8R60U9mZ42sSNvdPn2sQ==/109951162868126486.jpg",
            authority: 0,
            mutual: false,
            expertTags: null,
            experts: {
              1: "视频达人(华语、音乐现场)",
              2: "音乐图文达人",
            },
            djStatus: 0,
            vipType: 11,
            remarkName: null,
            avatarImgIdStr: "19041342370266626",
            backgroundImgIdStr: "109951162868126486",
          },
          urlInfo: {
            id: "75B27820714F0E08B5C06DB854D48C2B",
            url: "http://vodkgeyttp9.vod.126.net/cloudmusic/d334b81ba5eced474b18820f190b4f4f.mp4?ts=1624601396&rid=DCD0CB091AB82F68AC95437FC74CFB5B&rl=3&rs=PjCWuJfwzZPydfBEltGTrJocpPbIVepH&sign=930863c16a6538c6944d29cc69c5a309&ext=rua%2FxTcjfvTEiY%2B5HghoX8l%2FMhLiv%2F2ELsF56Vr9aEhe8vjRmFrVOQLUQPxVqbnWNQzlDDuE8EhqwEjttCZpjLX1WRIM6pB7262hiiyN427zXWYFTWGGUkb4fQxT%2FA4b0fK%2F%2BlyLDDWBQCiLV7Ow5UNn7LGkppqTxeOUslIL1EBLr%2FCoWU7JdH5brBe6wHKju1Dkd1%2FBykV8VLmTpzlvK%2BsXElApdlTwb%2FZHOCd1tEhzsRv2NXHMM0SGkcP8aRdh",
            size: 228246683,
            validityTime: 1200,
            needPay: false,
            payInfo: null,
            r: 1080,
          },
          videoGroup: [
            {
              id: 58100,
              name: "现场",
              alg: null,
            },
            {
              id: 11110,
              name: "林俊杰",
              alg: null,
            },
            {
              id: 5100,
              name: "音乐",
              alg: null,
            },
            {
              id: 4101,
              name: "娱乐",
              alg: null,
            },
            {
              id: 3101,
              name: "综艺",
              alg: null,
            },
            {
              id: 76108,
              name: "综艺片段",
              alg: null,
            },
            {
              id: 77102,
              name: "内地综艺",
              alg: null,
            },
          ],
          previewUrl: null,
          previewDurationms: 0,
          hasRelatedGameAd: false,
          markTypes: null,
          relateSong: [],
          relatedInfo: null,
          videoUserLiveInfo: null,
          vid: "75B27820714F0E08B5C06DB854D48C2B",
          durationms: 293083,
          playTime: 3674729,
          praisedCount: 23471,
          praised: false,
          subscribed: false,
        },
      },
      {
        type: 1,
        displayed: false,
        alg: "onlineHotGroup",
        extAlg: null,
        data: {
          alg: "onlineHotGroup",
          scm: "1.music-video-timeline.video_timeline.video.181017.-295043608",
          threadId: "R_VI_62_54475714955F67D49A953AD66A3B034C",
          coverUrl:
            "https://p1.music.126.net/GesDN4EZ4euBhTImfkuKew==/109951163572822423.jpg",
          height: 720,
          width: 1280,
          title: "张学友巅峰时期的嗓音，唱这首一直没机会唱的歌，歌神走心了",
          description:
            "张学友巅峰时期的嗓音，唱这首一直没机会唱的歌，歌神走心了",
          commentCount: 1383,
          shareCount: 908,
          resolutions: [
            {
              resolution: 240,
              size: 22168254,
            },
            {
              resolution: 480,
              size: 31616153,
            },
            {
              resolution: 720,
              size: 50807625,
            },
          ],
          creator: {
            defaultAvatar: false,
            province: 430000,
            authStatus: 0,
            followed: false,
            avatarUrl:
              "http://p1.music.126.net/s7UbKTvdHKzfQCRCoqbGEw==/18781857627506469.jpg",
            accountStatus: 0,
            gender: 2,
            city: 430100,
            birthday: -2209017600000,
            userId: 440542582,
            userType: 0,
            nickname: "虐心音乐厅",
            signature: "音乐视频自媒体",
            description: "",
            detailDescription: "",
            avatarImgId: 18781857627506468,
            backgroundImgId: 109951162868126480,
            backgroundUrl:
              "http://p1.music.126.net/_f8R60U9mZ42sSNvdPn2sQ==/109951162868126486.jpg",
            authority: 0,
            mutual: false,
            expertTags: null,
            experts: {
              1: "音乐视频达人",
            },
            djStatus: 0,
            vipType: 0,
            remarkName: null,
            avatarImgIdStr: "18781857627506469",
            backgroundImgIdStr: "109951162868126486",
          },
          urlInfo: {
            id: "54475714955F67D49A953AD66A3B034C",
            url: "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/pGifhFis_126558824_shd.mp4?ts=1624601396&rid=DCD0CB091AB82F68AC95437FC74CFB5B&rl=3&rs=EkNaPgfrHSJfZRIZXjWlgNazrBxJARTD&sign=b195756cc37503f3a912068d9672c160&ext=rua%2FxTcjfvTEiY%2B5HghoX8l%2FMhLiv%2F2ELsF56Vr9aEhe8vjRmFrVOQLUQPxVqbnWNQzlDDuE8EhqwEjttCZpjLX1WRIM6pB7262hiiyN427zXWYFTWGGUkb4fQxT%2FA4b0fK%2F%2BlyLDDWBQCiLV7Ow5UNn7LGkppqTxeOUslIL1EBLr%2FCoWU7JdH5brBe6wHKju1Dkd1%2FBykV8VLmTpzlvK%2BsXElApdlTwb%2FZHOCd1tEh0%2Beg%2FYZeZTZ%2FPzE%2Fcun9K",
            size: 50807625,
            validityTime: 1200,
            needPay: false,
            payInfo: null,
            r: 720,
          },
          videoGroup: [
            {
              id: 58100,
              name: "现场",
              alg: null,
            },
            {
              id: 57105,
              name: "粤语现场",
              alg: null,
            },
            {
              id: 57108,
              name: "流行现场",
              alg: null,
            },
            {
              id: 1100,
              name: "音乐现场",
              alg: null,
            },
            {
              id: 5100,
              name: "音乐",
              alg: null,
            },
            {
              id: 15136,
              name: "怀旧",
              alg: null,
            },
            {
              id: 15103,
              name: "张学友",
              alg: null,
            },
          ],
          previewUrl: null,
          previewDurationms: 0,
          hasRelatedGameAd: false,
          markTypes: null,
          relateSong: [
            {
              name: "岁月流情",
              id: 190548,
              pst: 0,
              t: 0,
              ar: [
                {
                  id: 6460,
                  name: "张学友",
                  tns: [],
                  alias: [],
                },
              ],
              alia: [],
              pop: 80,
              st: 0,
              rt: "600902000005290446",
              fee: 8,
              v: 28,
              crbt: null,
              cf: "",
              al: {
                id: 19252,
                name: "真情流露",
                picUrl:
                  "http://p4.music.126.net/C5DwldakIJjsCBmCOq_y3w==/109951166032411715.jpg",
                tns: [],
                pic_str: "109951166032411715",
                pic: 109951166032411710,
              },
              dt: 296306,
              h: {
                br: 320000,
                fid: 0,
                size: 11854411,
                vd: 8342,
              },
              m: {
                br: 192000,
                fid: 0,
                size: 7112664,
                vd: 10966,
              },
              l: {
                br: 128000,
                fid: 0,
                size: 4741791,
                vd: 12695,
              },
              a: null,
              cd: "1",
              no: 8,
              rtUrl: null,
              ftype: 0,
              rtUrls: [],
              djId: 0,
              copyright: 1,
              s_id: 0,
              rtype: 0,
              rurl: null,
              mst: 9,
              mv: 0,
              cp: 7003,
              publishTime: 702057600000,
              privilege: {
                id: 190548,
                fee: 8,
                payed: 0,
                st: 0,
                pl: 128000,
                dl: 0,
                sp: 7,
                cp: 1,
                subp: 1,
                cs: false,
                maxbr: 999000,
                fl: 128000,
                toast: false,
                flag: 4,
                preSell: false,
              },
            },
          ],
          relatedInfo: null,
          videoUserLiveInfo: null,
          vid: "54475714955F67D49A953AD66A3B034C",
          durationms: 190016,
          playTime: 3624871,
          praisedCount: 9583,
          praised: false,
          subscribed: false,
        },
      },
      {
        type: 1,
        displayed: false,
        alg: "onlineHotGroup",
        extAlg: null,
        data: {
          alg: "onlineHotGroup",
          scm: "1.music-video-timeline.video_timeline.video.181017.-295043608",
          threadId: "R_VI_62_4C3555F2D2057192B9C420247F750FEE",
          coverUrl:
            "https://p1.music.126.net/TSnkgeWmTTcbjQflN15iqw==/109951163124426531.jpg",
          height: 720,
          width: 1280,
          title: "霉霉 Welcome to New York 超震撼开场曲",
          description:
            " 霉霉#Taylor Swift# 1989世界巡演超震撼开场曲《Welcome to New York》，繁华的纽约城、摩登都市元素融合到演唱会现场，把流行女王的气质表现的淋淋尽致，Live比CD更有冲击感 嗨翻了",
          commentCount: 1095,
          shareCount: 5061,
          resolutions: [
            {
              resolution: 240,
              size: 37237444,
            },
            {
              resolution: 480,
              size: 53091305,
            },
            {
              resolution: 720,
              size: 84901080,
            },
          ],
          creator: {
            defaultAvatar: false,
            province: 140000,
            authStatus: 0,
            followed: false,
            avatarUrl:
              "http://p1.music.126.net/VjTR5tgZtoraCXr5Q67cAQ==/19043541393353186.jpg",
            accountStatus: 0,
            gender: 1,
            city: 140700,
            birthday: 612115200000,
            userId: 274343737,
            userType: 204,
            nickname: "手写的心",
            signature:
              "微博@手写的心 努力第一时间推送周杰伦、霉霉Taylor Swift、Cindy袁咏琳、林俊杰等明星影音类资讯（MV、Live现场、媒体播报全聚合)周杰伦中文网JayCn资讯组成员，分享更多好音乐！商业推广请私信",
            description: "",
            detailDescription: "",
            avatarImgId: 19043541393353184,
            backgroundImgId: 18720284976418740,
            backgroundUrl:
              "http://p1.music.126.net/GMx-zTqHbWw2pfW2_d-TfA==/18720284976418739.jpg",
            authority: 0,
            mutual: false,
            expertTags: null,
            experts: {
              1: "音乐视频达人",
            },
            djStatus: 10,
            vipType: 11,
            remarkName: null,
            avatarImgIdStr: "19043541393353186",
            backgroundImgIdStr: "18720284976418739",
          },
          urlInfo: {
            id: "4C3555F2D2057192B9C420247F750FEE",
            url: "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/lkd7f4A7_147502842_shd.mp4?ts=1624601396&rid=DCD0CB091AB82F68AC95437FC74CFB5B&rl=3&rs=yxaOfPjajufTFoVacTjVDwOjkIBNVpko&sign=0198a68bb06ce56528e46414f5ee5368&ext=rua%2FxTcjfvTEiY%2B5HghoX8l%2FMhLiv%2F2ELsF56Vr9aEhe8vjRmFrVOQLUQPxVqbnWNQzlDDuE8EhqwEjttCZpjLX1WRIM6pB7262hiiyN427zXWYFTWGGUkb4fQxT%2FA4b0fK%2F%2BlyLDDWBQCiLV7Ow5UNn7LGkppqTxeOUslIL1EBLr%2FCoWU7JdH5brBe6wHKju1Dkd1%2FBykV8VLmTpzlvK%2BsXElApdlTwb%2FZHOCd1tEh0%2Beg%2FYZeZTZ%2FPzE%2Fcun9K",
            size: 84901080,
            validityTime: 1200,
            needPay: false,
            payInfo: null,
            r: 720,
          },
          videoGroup: [
            {
              id: 58100,
              name: "现场",
              alg: null,
            },
            {
              id: 1100,
              name: "音乐现场",
              alg: null,
            },
            {
              id: 12100,
              name: "流行",
              alg: null,
            },
            {
              id: 5100,
              name: "音乐",
              alg: null,
            },
            {
              id: 16131,
              name: "英文",
              alg: null,
            },
            {
              id: 64100,
              name: "Taylor Swift",
              alg: null,
            },
            {
              id: 14137,
              name: "感动",
              alg: null,
            },
          ],
          previewUrl: null,
          previewDurationms: 0,
          hasRelatedGameAd: false,
          markTypes: null,
          relateSong: [
            {
              name: "Welcome To New York",
              id: 29561031,
              pst: 0,
              t: 0,
              ar: [
                {
                  id: 44266,
                  name: "Taylor Swift",
                  tns: [],
                  alias: [],
                },
              ],
              alia: [],
              pop: 100,
              st: 0,
              rt: null,
              fee: 1,
              v: 87,
              crbt: null,
              cf: "",
              al: {
                id: 3029801,
                name: "1989 (Deluxe)",
                picUrl:
                  "http://p4.music.126.net/3KDqQ9XW2Khj5Ia4tRqAAw==/18771962022688349.jpg",
                tns: [],
                pic_str: "18771962022688349",
                pic: 18771962022688348,
              },
              dt: 212000,
              h: {
                br: 320000,
                fid: 0,
                size: 8506735,
                vd: -27600,
              },
              m: {
                br: 192000,
                fid: 0,
                size: 5104129,
                vd: -25200,
              },
              l: {
                br: 128000,
                fid: 0,
                size: 3402826,
                vd: -23800,
              },
              a: null,
              cd: "1",
              no: 1,
              rtUrl: null,
              ftype: 0,
              rtUrls: [],
              djId: 0,
              copyright: 2,
              s_id: 0,
              rtype: 0,
              rurl: null,
              mst: 9,
              mv: 0,
              cp: 7003,
              publishTime: 1414339200007,
              privilege: {
                id: 29561031,
                fee: 1,
                payed: 0,
                st: 0,
                pl: 0,
                dl: 0,
                sp: 0,
                cp: 0,
                subp: 0,
                cs: false,
                maxbr: 999000,
                fl: 0,
                toast: false,
                flag: 1028,
                preSell: false,
              },
            },
            {
              name: "Welcome To New York (Karaoke Version)",
              id: 33337002,
              pst: 0,
              t: 0,
              ar: [
                {
                  id: 44266,
                  name: "Taylor Swift",
                  tns: [],
                  alias: [],
                },
              ],
              alia: [],
              pop: 100,
              st: 0,
              rt: null,
              fee: 1,
              v: 124,
              crbt: null,
              cf: "",
              al: {
                id: 3199003,
                name: "Taylor Swift Karaoke: 1989 (Deluxe Edition)",
                picUrl:
                  "http://p4.music.126.net/JI13dWBRcSzXDQEJeOLunA==/7804333535025554.jpg",
                tns: [],
                pic: 7804333535025554,
              },
              dt: 209449,
              h: {
                br: 320000,
                fid: 0,
                size: 8378036,
                vd: -36352,
              },
              m: {
                br: 192000,
                fid: 0,
                size: 5026839,
                vd: -33844,
              },
              l: {
                br: 128000,
                fid: 0,
                size: 3351240,
                vd: -32420,
              },
              a: null,
              cd: "1",
              no: 1,
              rtUrl: null,
              ftype: 0,
              rtUrls: [],
              djId: 0,
              copyright: 2,
              s_id: 0,
              rtype: 0,
              rurl: null,
              mst: 9,
              mv: 0,
              cp: 7003,
              publishTime: 1425312000007,
              privilege: {
                id: 33337002,
                fee: 1,
                payed: 0,
                st: 0,
                pl: 0,
                dl: 0,
                sp: 0,
                cp: 1,
                subp: 0,
                cs: false,
                maxbr: 320000,
                fl: 0,
                toast: false,
                flag: 1028,
                preSell: false,
              },
            },
            {
              name: "Welcome To New York (Karaoke Version)",
              id: 29979749,
              pst: 0,
              t: 0,
              ar: [
                {
                  id: 44266,
                  name: "Taylor Swift",
                  tns: [],
                  alias: [],
                },
              ],
              alia: [],
              pop: 75,
              st: 0,
              rt: null,
              fee: 1,
              v: 39,
              crbt: null,
              cf: "",
              al: {
                id: 3090339,
                name: "Taylor Swift Karaoke: 1989",
                picUrl:
                  "http://p4.music.126.net/TUorcPF0acWt-e23KihDHQ==/109951166119352134.jpg",
                tns: [],
                pic_str: "109951166119352134",
                pic: 109951166119352130,
              },
              dt: 209443,
              h: {
                br: 320000,
                fid: 0,
                size: 8378036,
                vd: -18700,
              },
              m: {
                br: 192000,
                fid: 0,
                size: 5026839,
                vd: -16200,
              },
              l: {
                br: 128000,
                fid: 0,
                size: 3351240,
                vd: -14900,
              },
              a: null,
              cd: "01",
              no: 1,
              rtUrl: null,
              ftype: 0,
              rtUrls: [],
              djId: 0,
              copyright: 1,
              s_id: 0,
              rtype: 0,
              rurl: null,
              mst: 9,
              mv: 0,
              cp: 7003,
              publishTime: 1422720000000,
              privilege: {
                id: 29979749,
                fee: 1,
                payed: 0,
                st: 0,
                pl: 0,
                dl: 0,
                sp: 0,
                cp: 1,
                subp: 0,
                cs: false,
                maxbr: 320000,
                fl: 0,
                toast: false,
                flag: 4,
                preSell: false,
              },
            },
          ],
          relatedInfo: null,
          videoUserLiveInfo: null,
          vid: "4C3555F2D2057192B9C420247F750FEE",
          durationms: 330263,
          playTime: 1878019,
          praisedCount: 22465,
          praised: false,
          subscribed: false,
        },
      },
      {
        type: 1,
        displayed: false,
        alg: "onlineHotGroup",
        extAlg: null,
        data: {
          alg: "onlineHotGroup",
          scm: "1.music-video-timeline.video_timeline.video.181017.-295043608",
          threadId: "R_VI_62_E9C79C1055587C8DD1CCA3D1E5513071",
          coverUrl:
            "https://p1.music.126.net/5zukJeTTLclQ0RaxXmfEiw==/109951163672050017.jpg",
          height: 720,
          width: 1280,
          title: "车祸现场？不存在的！看这些欧美歌手是如何机智救场的！",
          description:
            "车祸现场？不存在的！看看这些欧美女歌手是如何机智救场的！",
          commentCount: 56,
          shareCount: 45,
          resolutions: [
            {
              resolution: 240,
              size: 25611165,
            },
            {
              resolution: 480,
              size: 42864923,
            },
            {
              resolution: 720,
              size: 62256916,
            },
          ],
          creator: {
            defaultAvatar: false,
            province: 320000,
            authStatus: 1,
            followed: false,
            avatarUrl:
              "http://p1.music.126.net/29V_TvOcg8VPvGOyRQf9nw==/109951165482189661.jpg",
            accountStatus: 0,
            gender: 1,
            city: 320100,
            birthday: 788112000000,
            userId: 109093293,
            userType: 10,
            nickname: "萌德不萌",
            signature: "zzy1025071687（vx）合作推广",
            description: "欧美音乐资讯号",
            detailDescription: "欧美音乐资讯号",
            avatarImgId: 109951165482189660,
            backgroundImgId: 109951165988215120,
            backgroundUrl:
              "http://p1.music.126.net/Kj4fYKku-4iPe0VhNpgLcg==/109951165988215119.jpg",
            authority: 0,
            mutual: false,
            expertTags: ["华语", "电子", "欧美"],
            experts: {
              2: "欧美音乐资讯达人",
            },
            djStatus: 10,
            vipType: 11,
            remarkName: null,
            avatarImgIdStr: "109951165482189661",
            backgroundImgIdStr: "109951165988215119",
          },
          urlInfo: {
            id: "E9C79C1055587C8DD1CCA3D1E5513071",
            url: "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/HDYNb0Pj_2120181914_shd.mp4?ts=1624601396&rid=DCD0CB091AB82F68AC95437FC74CFB5B&rl=3&rs=FnmvXlyRbSDAkxNpgTuTOGwjaMGNLLcQ&sign=796094c5699a29e1322d1d7a1a45debc&ext=rua%2FxTcjfvTEiY%2B5HghoX8l%2FMhLiv%2F2ELsF56Vr9aEhe8vjRmFrVOQLUQPxVqbnWNQzlDDuE8EhqwEjttCZpjLX1WRIM6pB7262hiiyN427zXWYFTWGGUkb4fQxT%2FA4b0fK%2F%2BlyLDDWBQCiLV7Ow5UNn7LGkppqTxeOUslIL1EBLr%2FCoWU7JdH5brBe6wHKju1Dkd1%2FBykV8VLmTpzlvK%2BsXElApdlTwb%2FZHOCd1tEh0%2Beg%2FYZeZTZ%2FPzE%2Fcun9K",
            size: 62256916,
            validityTime: 1200,
            needPay: false,
            payInfo: null,
            r: 720,
          },
          videoGroup: [
            {
              id: 58100,
              name: "现场",
              alg: null,
            },
            {
              id: 57106,
              name: "欧美现场",
              alg: null,
            },
            {
              id: 57108,
              name: "流行现场",
              alg: null,
            },
            {
              id: 59108,
              name: "巡演现场",
              alg: null,
            },
            {
              id: 1100,
              name: "音乐现场",
              alg: null,
            },
            {
              id: 5100,
              name: "音乐",
              alg: null,
            },
          ],
          previewUrl: null,
          previewDurationms: 0,
          hasRelatedGameAd: false,
          markTypes: null,
          relateSong: [],
          relatedInfo: null,
          videoUserLiveInfo: null,
          vid: "E9C79C1055587C8DD1CCA3D1E5513071",
          durationms: 277316,
          playTime: 180192,
          praisedCount: 836,
          praised: false,
          subscribed: false,
        },
      },
      {
        type: 1,
        displayed: false,
        alg: "onlineHotGroup",
        extAlg: null,
        data: {
          alg: "onlineHotGroup",
          scm: "1.music-video-timeline.video_timeline.video.181017.-295043608",
          threadId: "R_VI_62_D28566EB0ED13932AD62A0E1F2656060",
          coverUrl:
            "https://p1.music.126.net/ez744L-04v_VGJ7rCdS2rg==/109951164696314774.jpg",
          height: 360,
          width: 634,
          title: "李凡一 《亲爱的那不是爱情》冠军战队争夺战",
          description: "",
          commentCount: 69,
          shareCount: 225,
          resolutions: [
            {
              resolution: 240,
              size: 22599230,
            },
          ],
          creator: {
            defaultAvatar: false,
            province: 440000,
            authStatus: 1,
            followed: false,
            avatarUrl:
              "http://p1.music.126.net/IaxvCYCpxCWde7t747ewuA==/109951165313687610.jpg",
            accountStatus: 0,
            gender: 1,
            city: 441500,
            birthday: 1043769600000,
            userId: 1688690650,
            userType: 4,
            nickname: "D丶DOS",
            signature: "Brakes are death",
            description: "",
            detailDescription: "",
            avatarImgId: 109951165313687620,
            backgroundImgId: 109951165147376770,
            backgroundUrl:
              "http://p1.music.126.net/mI0U1TGJai0InUDD8q9aCA==/109951165147376773.jpg",
            authority: 0,
            mutual: false,
            expertTags: null,
            experts: null,
            djStatus: 10,
            vipType: 0,
            remarkName: null,
            avatarImgIdStr: "109951165313687610",
            backgroundImgIdStr: "109951165147376773",
          },
          urlInfo: {
            id: "D28566EB0ED13932AD62A0E1F2656060",
            url: "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/n25gWYnk_2900982801_sd.mp4?ts=1624601396&rid=DCD0CB091AB82F68AC95437FC74CFB5B&rl=3&rs=BEVnTUdBfyZBWTpCkNgyvCQoezlRCurk&sign=b75da8cb4cb4a92d10f3dcd375ee6af9&ext=rua%2FxTcjfvTEiY%2B5HghoX8l%2FMhLiv%2F2ELsF56Vr9aEhe8vjRmFrVOQLUQPxVqbnWNQzlDDuE8EhqwEjttCZpjLX1WRIM6pB7262hiiyN427zXWYFTWGGUkb4fQxT%2FA4b0fK%2F%2BlyLDDWBQCiLV7Ow5UNn7LGkppqTxeOUslIL1EBLr%2FCoWU7JdH5brBe6wHKju1Dkd1%2FBykV8VLmTpzlvK%2BsXElApdlTwb%2FZHOCd1tEh0%2Beg%2FYZeZTZ%2FPzE%2Fcun9K",
            size: 22599230,
            validityTime: 1200,
            needPay: false,
            payInfo: null,
            r: 240,
          },
          videoGroup: [
            {
              id: 58100,
              name: "现场",
              alg: null,
            },
            {
              id: 1100,
              name: "音乐现场",
              alg: null,
            },
            {
              id: 5100,
              name: "音乐",
              alg: null,
            },
            {
              id: 4101,
              name: "娱乐",
              alg: null,
            },
            {
              id: 3101,
              name: "综艺",
              alg: null,
            },
          ],
          previewUrl: null,
          previewDurationms: 0,
          hasRelatedGameAd: false,
          markTypes: null,
          relateSong: [],
          relatedInfo: null,
          videoUserLiveInfo: null,
          vid: "D28566EB0ED13932AD62A0E1F2656060",
          durationms: 230080,
          playTime: 241974,
          praisedCount: 1459,
          praised: false,
          subscribed: false,
        },
      },
      {
        type: 1,
        displayed: false,
        alg: "onlineHotGroup",
        extAlg: null,
        data: {
          alg: "onlineHotGroup",
          scm: "1.music-video-timeline.video_timeline.video.181017.-295043608",
          threadId: "R_VI_62_8F4FAA3C7EC50E0DB127C69162A12760",
          coverUrl:
            "https://p1.music.126.net/XhOxyEcfd-1kWP8sQub2zw==/109951163773746979.jpg",
          height: 720,
          width: 1280,
          title: "【王俊凯】醒着 | 20181231跨年演唱会",
          description: "20181231 湖南卫视跨年演唱会 王俊凯 ·《醒着》 ",
          commentCount: 33,
          shareCount: 44,
          resolutions: [
            {
              resolution: 240,
              size: 27386379,
            },
            {
              resolution: 480,
              size: 47972294,
            },
            {
              resolution: 720,
              size: 79871101,
            },
          ],
          creator: {
            defaultAvatar: false,
            province: 110000,
            authStatus: 0,
            followed: false,
            avatarUrl:
              "http://p1.music.126.net/eNFgbOzQT63jj6pdi9GYIw==/109951163682325719.jpg",
            accountStatus: 0,
            gender: 0,
            city: 110101,
            birthday: -2209017600000,
            userId: 1679823210,
            userType: 0,
            nickname: "用户1679823210",
            signature: "王俊凯王源双人图博",
            description: "",
            detailDescription: "",
            avatarImgId: 109951163682325710,
            backgroundImgId: 109951162868128400,
            backgroundUrl:
              "http://p1.music.126.net/2zSNIqTcpHL2jIvU6hG0EA==/109951162868128395.jpg",
            authority: 0,
            mutual: false,
            expertTags: null,
            experts: null,
            djStatus: 0,
            vipType: 0,
            remarkName: null,
            avatarImgIdStr: "109951163682325719",
            backgroundImgIdStr: "109951162868128395",
          },
          urlInfo: {
            id: "8F4FAA3C7EC50E0DB127C69162A12760",
            url: "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/hvVtzRkU_2229323652_shd.mp4?ts=1624601396&rid=DCD0CB091AB82F68AC95437FC74CFB5B&rl=3&rs=xovrikjgJWIYmDVOkypylICMlsvIGQwj&sign=45a3d1d2a8432d9be788062bd3612fec&ext=rua%2FxTcjfvTEiY%2B5HghoX8l%2FMhLiv%2F2ELsF56Vr9aEhe8vjRmFrVOQLUQPxVqbnWNQzlDDuE8EhqwEjttCZpjLX1WRIM6pB7262hiiyN427zXWYFTWGGUkb4fQxT%2FA4b0fK%2F%2BlyLDDWBQCiLV7Ow5UNn7LGkppqTxeOUslIL1EBLr%2FCoWU7JdH5brBe6wHKju1Dkd1%2FBykV8VLmTpzlvK%2BsXElApdlTwb%2FZHOCd1tEhzsRv2NXHMM0SGkcP8aRdh",
            size: 79871101,
            validityTime: 1200,
            needPay: false,
            payInfo: null,
            r: 720,
          },
          videoGroup: [
            {
              id: 58100,
              name: "现场",
              alg: null,
            },
            {
              id: 59101,
              name: "华语现场",
              alg: null,
            },
            {
              id: 57108,
              name: "流行现场",
              alg: null,
            },
            {
              id: 57110,
              name: "饭拍现场",
              alg: null,
            },
            {
              id: 11137,
              name: "TFBOYS",
              alg: null,
            },
            {
              id: 1100,
              name: "音乐现场",
              alg: null,
            },
            {
              id: 5100,
              name: "音乐",
              alg: null,
            },
            {
              id: 25108,
              name: "王俊凯",
              alg: null,
            },
          ],
          previewUrl: null,
          previewDurationms: 0,
          hasRelatedGameAd: false,
          markTypes: null,
          relateSong: [],
          relatedInfo: null,
          videoUserLiveInfo: null,
          vid: "8F4FAA3C7EC50E0DB127C69162A12760",
          durationms: 237861,
          playTime: 48439,
          praisedCount: 688,
          praised: false,
          subscribed: false,
        },
      },
      {
        type: 1,
        displayed: false,
        alg: "onlineHotGroup",
        extAlg: null,
        data: {
          alg: "onlineHotGroup",
          scm: "1.music-video-timeline.video_timeline.video.181017.-295043608",
          threadId: "R_VI_62_472186A5B9F1BADDF671FA99469957FB",
          coverUrl:
            "https://p1.music.126.net/9guqmxyw-C9OUHVDRMQe6g==/109951163948466907.jpg",
          height: 720,
          width: 1280,
          title: "T-ara这首《Lovey Dovey》让你热血沸腾观众眼睛都看直了",
          description: "T-ara这首《Lovey Dovey》让你热血沸腾，观众眼睛都看直了",
          commentCount: 91,
          shareCount: 65,
          resolutions: [
            {
              resolution: 240,
              size: 47816842,
            },
            {
              resolution: 480,
              size: 82941586,
            },
            {
              resolution: 720,
              size: 119406531,
            },
          ],
          creator: {
            defaultAvatar: false,
            province: 510000,
            authStatus: 0,
            followed: false,
            avatarUrl:
              "http://p1.music.126.net/vUd5xKJJk8DsL3uv-V5wIg==/109951163880600438.jpg",
            accountStatus: 0,
            gender: 0,
            city: 510500,
            birthday: -2209017600000,
            userId: 1771507866,
            userType: 204,
            nickname: "荒草音乐",
            signature: "",
            description: "",
            detailDescription: "",
            avatarImgId: 109951163880600430,
            backgroundImgId: 109951165492077660,
            backgroundUrl:
              "http://p1.music.126.net/-3xs1LIOhcJBNCFkSh0G3g==/109951165492077657.jpg",
            authority: 0,
            mutual: false,
            expertTags: null,
            experts: {
              1: "超燃联盟视频达人",
            },
            djStatus: 0,
            vipType: 0,
            remarkName: null,
            avatarImgIdStr: "109951163880600438",
            backgroundImgIdStr: "109951165492077657",
          },
          urlInfo: {
            id: "472186A5B9F1BADDF671FA99469957FB",
            url: "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/utjhdDdw_2396127727_shd.mp4?ts=1624601396&rid=DCD0CB091AB82F68AC95437FC74CFB5B&rl=3&rs=hdumeMBoqzcReDFAVYZUFokaISNwSAgJ&sign=6e1f1d4ec497b77a5e3b4007aa2ff498&ext=rua%2FxTcjfvTEiY%2B5HghoX8l%2FMhLiv%2F2ELsF56Vr9aEhe8vjRmFrVOQLUQPxVqbnWNQzlDDuE8EhqwEjttCZpjLX1WRIM6pB7262hiiyN427zXWYFTWGGUkb4fQxT%2FA4b0fK%2F%2BlyLDDWBQCiLV7Ow5UNn7LGkppqTxeOUslIL1EBLr%2FCoWU7JdH5brBe6wHKju1Dkd1%2FBykV8VLmTpzlvK%2BsXElApdlTwb%2FZHOCd1tEh0%2Beg%2FYZeZTZ%2FPzE%2Fcun9K",
            size: 119406531,
            validityTime: 1200,
            needPay: false,
            payInfo: null,
            r: 720,
          },
          videoGroup: [
            {
              id: 58100,
              name: "现场",
              alg: null,
            },
            {
              id: 9102,
              name: "演唱会",
              alg: null,
            },
            {
              id: 57107,
              name: "韩语现场",
              alg: null,
            },
            {
              id: 57108,
              name: "流行现场",
              alg: null,
            },
            {
              id: 9127,
              name: "T-ara",
              alg: null,
            },
            {
              id: 1100,
              name: "音乐现场",
              alg: null,
            },
            {
              id: 5100,
              name: "音乐",
              alg: null,
            },
          ],
          previewUrl: null,
          previewDurationms: 0,
          hasRelatedGameAd: false,
          markTypes: null,
          relateSong: [],
          relatedInfo: null,
          videoUserLiveInfo: null,
          vid: "472186A5B9F1BADDF671FA99469957FB",
          durationms: 245226,
          playTime: 333114,
          praisedCount: 1168,
          praised: false,
          subscribed: false,
        },
      },
    ];
    let { videoList } = this.data;
    //将视频最新的数据更新到原有视频数据中
    //这里用的...是es6语法扩展运算符
    videoList.push(...newVideoList);
    this.setData({
      videoList,
    });
  },
  toSearch() {
    wx.navigateTo({
      url: "/pages/search/search",
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
  onPullDownRefresh: function () {
    console.log("页面的下拉刷新");
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("刷新");
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function ({ from }) {},
});
