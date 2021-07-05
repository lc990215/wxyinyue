import config from "./config";
//发送ajax请求
function request(options) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.host + options.url,
      data: options.data ? options.data : {},
      method: options.method ? options.method : "GET",
      header: {
        cookie: wx.getStorageSync("cookies")
          ? JSON.parse(wx.getStorageSync("cookies")).find(
              (item) => item.indexOf("MUSIC_U") !== -1
            )
          : "",
      },
      success: (res) => {
        if (options.isLogin) {
          //将用户的cookies 存入本地
          wx.setStorage({
            key: "cookies",
            data: JSON.stringify(res.cookies),
          });
        }
        resolve(res.data);
        // 修改promise状态为成功返回成功的值
      },
      fail: (err) => {
        reject(err);
        //修改promise状态为失败返回失败的值
      },
    });
  });
}

export default request;
