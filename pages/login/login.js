import request from "../../utils/request";
// pages/login/login.js
/*登录流程

1。收集表单数据
2. 前端验证：{
  1）验证用户信息（账号、密码）是否合法
  2）前端验证不通过就提示用户，不需要发请求给后端
  3）前端验证通过了，发请求（携带账号，密码）给服务器
3。后端验证：{
  1）验证用户是否存在
  2）用户不存在直接返回，告诉前端用户不存在
  3）用户存在需要验证密码是否正确
  4）密码不正确返回给前端提示密码不正确
  5）密码正确返回给前端数据，提示用户登录成功（会携带用户的相关信息）
}
}


*/
Page({
  /**
   * 页面的初始数据
   */
  data: {
    phone: "",
    password: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  //表单内容发生改变的回调
  handleInput(e) {
    let type = e.target.dataset.type;
    this.setData({
      [type]: e.detail.value,
    });
  },
  async login() {
    let { phone, password } = this.data;
    //前端验证
    /*
    手机号验证
    1.内容为空
    2.手机号格式不正确
    3。手机号正确 验证通过
    */
    if (!phone) {
      wx.showToast({
        title: "手机号不能为空",
        icon: "none",
      });
      return;
    }
    let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/;
    if (!phoneReg.test(phone)) {
      wx.showToast({
        title: "手机号格式错误",
        icon: "none",
      });
      return;
    }

    if (!password) {
      wx.showToast({
        title: "密码不能为空",
        icon: "none",
      });
      return;
    }

    //后端验证
    let result = await request({
      url: "/login/cellphone",
      data: {
        phone: phone,
        password: password,
      },
      isLogin: true,
    });
    //登录成功
    if (result.code === 200) {
      wx.showToast({
        title: "登录成功",
      });
      //将用户信息存储至本地
      wx.setStorageSync("userInfo", JSON.stringify(result.profile));
      //跳转至个人中心页面
      wx.reLaunch({
        url: "/pages/personal/personal",
      });
    } else if (result.code === 400) {
      wx.showToast({
        title: "手机号错误",
        icon: "none",
      });
    } else if (result.code === 502) {
      wx.showToast({
        title: "密码错误",
        icon: "none",
      });
    } else if (result.code === 509) {
      wx.showToast({
        title: "密码错误次数过多，十分钟后重试",
        icon: "none",
      });
    } else {
      wx.showToast({
        title: "登录失败，请重新登录",
        icon: "none",
      });
    }
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