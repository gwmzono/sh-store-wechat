// pages/dialogue/dialogue.js
const app = getApp();
const { $Toast } = require('../../ivu/base/index');
const { getDialogue } = require('../../utils/getDialogue');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    index:0,
    message:'',
    itemTitle:'',
    userInfo:{},
    dialogueList:[],
    timer:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //设置对话索引
    this.setData({
      index:options.index,
    })
    //获取用户信息
    const userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo,
    })
    //设置定时任务
    const timer = setInterval(()=>{
      this.syncDialogueList();
    },5000)
    this.syncDialogueList();
    this.setData({timer});
  },

  onUnload(){
    clearInterval(this.data.timer);
  },

  //获取对应索引的对话信息
  syncDialogueList() {
    app.wxGet('dialogue', { user_id: this.data.userInfo.id }, data => {
      const list = getDialogue(data);
      this.setData({
        dialogueList: list[this.data.index],
      })
      this.setData({itemTitle:this.data.dialogueList[0].item_title});
      wx.pageScrollTo({
        selector: '#page-bottom',
      })
    }, () => {
      $Toast({
        type: 'error',
        content: '发送失败,请检查网络'
      })
    });
  },

  //同步输入
  syncMessage({detail}){
    this.setData({
      message: detail.value,
      duration: 100,
    })
  },
  //点击发送按钮
  pressSend(){
    const from = this.data.userInfo.id;
    let to = this.data.dialogueList[0].from;
    if(to === from){
      to = this.data.dialogueList[0].to;
    }
    const message = this.data.message;
    const item_id = this.data.dialogueList[0].item_id;
    app.wxPost('sendMessage',{from,to,message,item_id},()=>{
      this.setData({message:''});
      this.syncDialogueList();
    },()=>{
      $Toast({
        type: 'error',
        content: '发送失败'
      })
    })
  },
})