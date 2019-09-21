// pages/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginStatus: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    if(wx.getStorageSync('userInfo')){
      this.setData({
        loginStatus: true,
      })
    }
  },

  //点击登录按钮
  pressLoginButton(){
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  //
  pressLogoutButton(){
    this.setData({
      loginStatus: false,
    });
    wx.removeStorageSync('userInfo')
    wx.removeStorageSync('token')
  },
})