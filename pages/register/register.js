// pages/register/register.js

const app = getApp();
const { $Toast } = require('../../ivu/base/index');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    school:'',
    phone:'',
    password:'',
    rePassword:'',
    nickname:'',
  },

  //绑定学校
  changeSchool({detail}){
    this.setData({school:detail.value.trim()})
  },
  //绑定手机号
  changePhone({detail}){
    this.setData({phone:detail.value.trim()})
  },
  //绑定密码
  changePassword({ detail }){
    this.setData({password: detail.value.trim() })
  },
  //绑定确认密码
  changeRePassword({ detail }){
    this.setData({rePassword: detail.value.trim() })
  },
  //绑定昵称
  changeNickname({ detail }){
    this.setData({nickname: detail.value.trim() })
  },

  //检查学校
  checkSchool(val){
    const regexp = /^[\u4e00-\u9fa5]{4,20}$/;
    let returnValue = val.search(regexp);
    if(returnValue === -1){
      $Toast({
        type:'error',
        content:'学校名称错误',
      })
      return false;
    }
    return true;
  },
  //检查手机
  checkPhone(val){
    const regexp = /^1[3-9]\d{9}$/i;
    let returnValue = val.search(regexp);
    if (returnValue === -1) {
      $Toast({
        type: 'error',
        content: '用户名是11位手机号'
      })
      return false;
    }
    return true;
  },
  //检查密码
  checkPassword(val){
    const regexp = /^[a-z]\w{7,}$/i;
    let returnValue = val.search(regexp);
    if (returnValue === -1){
      $Toast({
        type: 'error',
        content: '密码需以字母开头并大于8位'
      })
      return false;
    }
    return true;
  },
  //确认密码
  checkRePassword(val){
    let pass = this.data.password;
    if(pass !== val){
      $Toast({
        type: 'error',
        content: '两次密码不一致',
      })
      return false;
    }
    return true;
  },

  //注册操作
  pressRegisterButton(){
    if(!this.checkSchool(this.data.school)){
      return false;
    }
    if (!this.checkPhone(this.data.phone)){
      return false;
    }
    if (!this.checkPassword(this.data.password)){
      return false;
    }
    if (!this.checkRePassword(this.data.rePassword)){
      return false;
    }
    app.wxPost('register',{
      phone:this.data.phone,
      password:this.data.password,
      school:this.data.school,
      nickname:this.data.nickname,
    },(res)=>{
      if(!res.err){
        $Toast({
          type:"success",
          content:"正在自动登录..."
        })
        setTimeout(()=>{
          $Toast.hide();
          const loginTask = app.wxPost('login',{
            phone: this.data.phone,
            password: this.data.password,
          },(data)=>{
            if (data.err) {
              $Toast({
                type: 'error',
                content: data.err
              })
            } else {
              wx.switchTab({
                url: '/pages/index/index',
              })
            }
          },()=>{});
          loginTask.onHeadersReceived(function (res) {
            const token = res.header['x-token'];
            if (!token) { return false; }
            let userInfo = JSON.parse(atob(token.split('.')[1]).replace(/\}.*$/, "}"));
            wx.setStorageSync('userInfo', userInfo);
            wx.setStorageSync('token', token);
          });
        },1500);
      }else{
        $Toast({
          type:'error',
          content: res.err,
        })
      }
    },()=>{
      $Toast({
        type:'error',
        content: '注册失败,请检查网络',
      })
    })
  },
})