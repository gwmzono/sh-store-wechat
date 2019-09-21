// pages/detail/detail.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemInfo: {},
    time: '',
    imgList: [],
    message: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.item;
    app.wxGet('item',{id},(res) => {
      let tempList = JSON.parse(res.pic);
      let imgList = [];
      for (let img of tempList) {
        imgList.push(`${app.appData.baseUrl}uploads/${img}`);
      }
      this.setData({
        itemInfo: res,
        time: app.time2string(res.create_time),
        imgList,
      })
    },err => {
      console.log(err);
    })
  },
  //同步textarea
  syncValue({detail}){
    this.setData({
      message: detail.value
    })
  },
  //留言
  leaveMessage(){
  }
})