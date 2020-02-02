// pages/mine/mine.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    loginStatus: false,
    unregisterVisible: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    if(wx.getStorageSync('userInfo')){
      const userInfo = wx.getStorageSync('userInfo');
      this.setData({
        loginStatus: true,
        userInfo,
      })
    }else{
      this.setData({
        loginStatus: false,
      })
    }
  },

  //点击注册按钮
  pressRegisterButton(){
    wx.navigateTo({
      url: '/pages/register/register',
    })
  },

  //点击登录按钮
  pressLoginButton(){
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },

  //检查登录状态
  checkLogin(){
    if (!app.checkLogin()) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },

  //点击我的消息按钮
  pressMessage(){
    this.checkLogin();
    wx.navigateTo({
      url: `/pages/message/message`,
    })
  },
  //点击物品列表
  pressItemList(){
    this.checkLogin();
    wx.navigateTo({
      url: '/pages/itemList/itemList',
    })
  },
  //点击修改密码
  pressChangePassword(){
    this.checkLogin();
    wx.navigateTo({
      url: '/pages/changePassword/changePassword',
    })
  },
  //点击登出按钮
  pressLogoutButton() {
    this.setData({
      loginStatus: false,
    });
    wx.removeStorageSync('userInfo')
    wx.removeStorageSync('token')
  },
  //点击注销账户
  pressUnregister(){
    this.checkLogin();
    this.setData({
      unregisterVisible:true
    })
  },
  //确认注销
  confirmUnregister() {
    this.setData({
      unregisterVisible: false
    })
  },
  //取消注销
  cancelUnregister(){
    this.setData({
      unregisterVisible: false
    })
  },
})