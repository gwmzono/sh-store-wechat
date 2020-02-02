// pages/detail/detail.js
const app = getApp();
const { $Toast } = require('../../ivu/base/index');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    ifFocus:false,
    buttonText:'给Ta留言',
    ifHidden:true,
    message:'',
    itemInfo: {},
    time: '',
    imgList: [],
    breadList:[{name:'首页', to:'index'}],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取用户信息
    this.setData({
      userInfo: wx.getStorageSync('userInfo'),
    })
    //获取商品信息
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
      console.error(err);
    })
  },

  //留言
  leaveMessage(){
    if (!app.checkLogin()){
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return false;
    }
    //设置按钮文字以及输入框的显示
    this.setData({
      ifHidden:!this.data.ifHidden,
      buttonText: this.data.buttonText === '隐藏' ? '给Ta留言' :'隐藏'
    })
  },

  //同步消息
  syncMessage({detail}){
    this.setData({
      message:detail.value,
    })
  },

  //发送消息
  sendMessage(){
    const message = this.data.message;
    this.setData({
      ifFocus: message === '' ? true : false,
    })
    //消息不空时发送消息
    if(message !== ''){
      const from = this.data.userInfo.id;
      const to = this.data.itemInfo.user_id;
      const item_id = this.data.itemInfo.id;
      app.wxPost('sendMessage',{
        from,to,item_id,message,
      },()=>{
        this.setData({
          message:'',
          ifHidden: true
        });
        wx.navigateTo({
          url: '/pages/dialogue/dialogue?index=0',
        })
      },()=>{
        $Toast({
          type:'error',
          content:'发送失败,请检查网络'
        })
      });
    }
  },
})