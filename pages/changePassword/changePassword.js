// pages/changePassword/changePassword.js
const app = getApp();
const { $Toast } = require('../../ivu/base/index');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    originPass:'',
    newPass:'',
    rePass:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //检查登录状态并引入用户信息
    if(!app.checkLogin()){
    wx.navigateTo({
      url: '/pages/login/login',
    })}
    this.setData({userInfo: wx.getStorageSync('userInfo')});
  },

  //同步原密码
  syncOriginPass({ detail }){
    this.setData({ originPass: detail.value });
  },

  //同步新密码
  syncNewPass({ detail }){
    this.setData({ newPass: detail.value });
  },

  //同步确认密码
  syncRePass({ detail }){
    this.setData({ rePass: detail.value });
  },

  //检查初始密码
  checkOriginPass(){
    const text = this.data.originPass;
    const regexp = /^[a-z]\w{7,}$/i;
    if(text.search(regexp) === -1){
      $Toast({
        type: "error",
        content: "[初始密码] 密码以字母开头且大于8位"
      });
      return false;
    }
    return true;
  },

  //检查新密码
  checkNewPass(){
    const text = this.data.newPass;
    const regexp = /^[a-z]\w{7,}$/i;
    if (text.search(regexp) === -1) {
      $Toast({
        type: "error",
        content: "[新密码] 密码以字母开头且大于8位"
      });
      return false;
    }
    return true;
  },

  //检查确认密码
  checkRePass(){
    const text = this.data.rePass;
    if(this.data.newPass !== text){
      $Toast({
        type: "error",
        content: "两次输入不一致"
      });
      return false;
    }
    return true;
  },

  //确认修改
  confirmChange(){
    if (!this.checkOriginPass()) { return false; }
    if (!this.checkNewPass()) { return false; }
    if (!this.checkRePass()) { return false; }
    const id = this.data.userInfo.id;
    const origin = this.data.originPass;
    const password = this.data.newPass;
    app.wxPost("changePassword",{id,origin,password},data=>{
      //有错误时
      if(data.err){
        $Toast({
          type:'error',
          content: data.err
        })
        return false;
      }
      //无措
      $Toast({
        type: 'success',
        content: '修改成功,正在跳转我的页面...'
      })
      setTimeout(()=>{
        wx.switchTab({
          url: '/pages/mine/mine',
        })
      }, 1500);
    },()=>{
      $Toast({
        type: 'error',
        content: '修改失败,请检查网络'
      })
    })
  },
})