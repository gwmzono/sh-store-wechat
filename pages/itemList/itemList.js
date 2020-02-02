// pages/itemList/itemList.js
const app = getApp();
const { $Toast } = require('../../ivu/base/index');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    itemList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const userInfo = wx.getStorageSync('userInfo');
    const user_id = userInfo.id;
    this.setData({userInfo});
    app.wxGet('allItem',{user_id},(data)=>{
      for(let i in data){
        if(data[i].title.length > 20){
          data[i].title = data[i].title.slice(0,20) + '...';
        }
      }
      this.setData({
        itemList:data,
      })
    },()=>{
      $Toast({
        type: 'error',
        content: '物品列表获取失败,请检查网络'
      })
    })
  },

  //点击物品
  clickItem(payload){
    const index = payload.target.dataset.index;
    const item_id = this.data.itemList[index].id;
    wx.navigateTo({
      url: `/pages/detail/detail?item=${item_id}`,
    })
  },
})