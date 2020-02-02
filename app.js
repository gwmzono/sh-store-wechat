//app.js
const { $Toast } = require('ivu/base/index');

App({
  //公共参数
  appData: {
    baseUrl: 'https://store.zono.pub/',
  },
  //时间字符串化
  time2string(timestamp){
    let t = new Date();
    t.setTime(timestamp*1000);
    return `${t.getFullYear()}-${t.getMonth() + 1}-${t.getDate()}`;
  },
  //检查登录状态,已登录返回true
  checkLogin(){
    let userInfo = wx.getStorageSync('userInfo');
    if (!userInfo||userInfo.expire_at * 1000 < (new Date().getTime())) {
      wx.removeStorageSync('userInfo');
      wx.removeStorageSync('token');
      return false;
    }
    return true;
  },
  //get方法封装
  wxGet(_interface, params, successFun, errorFun){
    //如果登陆超时, 就删除用户信息和token
    this.checkLogin();
    //获取token并发送请求
    let token = wx.getStorageSync('token');
    let requestTask = wx.request({
      url: `https://api.store.zono.pub/${_interface}`,
      data: params,
      method: 'GET',
      header: {'x-token': token},
      success(res){
        successFun(res.data);
      },
      fail(){
        errorFun();
      }
    })
    return requestTask;
  },
  //post方法封装
  wxPost(_interface, params, successFun, errorFun) {
    this.checkLogin();
    let token = wx.getStorageSync('token');
    let requestTask = wx.request({
      url: `https://api.store.zono.pub/${_interface}`,
      data: params,
      method: 'POST',
      header: { 'x-token': token },
      success(res) {
        //如果返回401就删除用户信息和token
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
      fail(){
        errorFun();
      }
    })
    return requestTask;
  },
  //微信个大坑比, 上传文件返回的data是字符串...
  wxUpload(_interface, filePath, successFun, errorFun, name="image"){
    this.checkLogin();
    let token = wx.getStorageSync('token');
    let uploadTask = wx.uploadFile({
      url: `https://api.store.zono.pub/${_interface}`,
      filePath: filePath,
      name,
      header: { 'x-token': token },
      success(res){
        if(res.data.err || res.statusCode !== 200){
          $Toast({
            type:'error',
            content: res.data.err || '未知错误',
          })
          return false;
        }
        //在这里要解析出对象做参数
        successFun(JSON.parse(res.data));
      },
      fail(){
        errorFun();
      }
    });
    return uploadTask;
  },
})