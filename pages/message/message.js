// pages/message/message.js
const app = getApp();
const {getDialogue} = require('../../utils/getDialogue');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dialogueList:[],//二维数组,一维是类别,二维是具体数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const userInfo = wx.getStorageSync('userInfo')
    app.wxGet('dialogue', {user_id:userInfo.id}, data => {
      const dialogueList = getDialogue(data);
      this.setData({
        dialogueList,
      })
    }, err => {
      console.error(err);
    })
  },

  //点击具体对话
  pressDialogue(payload){
    const index = payload.target.dataset.index;
    wx.navigateTo({
      url: `/pages/dialogue/dialogue?index=${index}`,
    })
  }
})