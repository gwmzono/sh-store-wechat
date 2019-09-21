// pages/login/login.js
const app = getApp();
const { $Toast } = require('../../ivu/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName:'',
    password: '',
  },

  //绑定用户名
  changeUserName({detail}){
    this.setData({userName: detail.value.trim()});
  },
  //绑定密码
  changePassword({ detail }){
    this.setData({ password: detail.value.trim() });
  },
  //检查用户名
  checkUserName({detail}){
    let regexp = /^1[3-9]\d{9}$/i;
    let returnValue = detail.value.search(regexp);
    if(returnValue === -1){
      $Toast({
        type: 'error',
        content: '用户名是13位手机号'
      })
      return false;
    }
    return true;
  },
  //检查密码
  checkPassword({detail}){
    let regexp = /^[a-z]\w{7,31}$/i;
    let returnValue = detail.value.search(regexp);
    if (returnValue === -1) {
      $Toast({
        type: 'error',
        content: '密码以字母开头且不小于8位'
      })
      return false;
    }
    return true;
  },
  //登录操作
  pressLoginButton(){
    if(!this.checkUserName({detail:{value: this.data.userName}})){
      return false;
    }
    if (!this.checkPassword({ detail: { value: this.data.password } })) {
      return false;
    }
    let loginTask = app.wxPost('login',{
      phone:this.data.userName,
      password: this.data.password,
    },(res)=>{
      if(res.err){
        $Toast({
          type: 'error',
          content: res.err
        })
      }else{
        wx.switchTab({
          url: '/pages/index/index',
        })
      }
    },()=>{
      console.error('未知错误');
    });
    loginTask.onHeadersReceived(function(res){
      const token = res.header['x-token'];
      if(!token){return false;}
      let userInfo = JSON.parse(atob(token.split('.')[1]));
      wx.setStorageSync('userInfo',userInfo);
      wx.setStorageSync('token',token);
    });
  }
})