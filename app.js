//app.js
const { $Toast } = require('ivu/base/index');

App({
  onLaunch: function () {
  },
  time2string(timestamp){
    let t = new Date();
    t.setTime(timestamp*1000);
    return `${t.getFullYear()}-${t.getMonth() + 1}-${t.getDate()}`;
  },
  wxGet(_interface, params, successFun, errorFun){
    let token = wx.getStorageSync('token');
    let requestTask = wx.request({
      url: `https://api.store.zono.pub/${_interface}`,
      data: params,
      method: 'GET',
      header: { 'x-token': token},
      success: (res) => {
        successFun(res.data);
      },
      fail: () => {
        errorFun();
      }
    })
    return requestTask;
  },
  wxPost(_interface, params, successFun, errorFun) {
    let token = wx.getStorageSync('token');
    let requestTask = wx.request({
      url: `https://api.store.zono.pub/${_interface}`,
      data: params,
      method: 'POST',
      header: { 'x-token': token },
      success: (res) => {
        if(res.statusCode === 401){
          console.error('登录已过期');
          wx.removeStorageSync('userInfo');
          wx.removeStorageSync('token');
          $Toast({
            type: 'error',
            content: '登录已超时'
          })
        }
        successFun(res.data);
      },
      fail: () => {
        errorFun();
      }
    })
    return requestTask;
  },
  appData: {
    baseUrl: 'https://store.zono.pub/',
  }
})