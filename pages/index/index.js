//index.js
//获取应用实例
const app = getApp()
const { $Toast } = require('../../ivu/base/index');

Page({
  //数据
  data: {
    schoolName: '选择学校',
    schoolList: [
      ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',],
      ['阿克苏','安宁','安庆','鞍山','安顺','安阳','安康'],
      ['阿克苏职业技术学院']
    ],
    itemName: "",
    cateList:['最新','电瓶车','自行车','书籍','艺术品','其他'],
    currentTab: '最新',
    itemList: '[]',
    itemNum: 0,
    size: 4,
    userInfo: '',
    visible: false,
    actionSheet: [{name: '退出登录'}],
    currentPage: 1,
    totalPage: 0,
  },

  //启动函数
  onLoad() {
    let schoolName = wx.getStorageSync('school');
    if(schoolName){
      this.setData({
        schoolName
      })
    }
    this.changeTab({ detail: { key: '最新' } });
  },
  onShow(){
    let userInfo = wx.getStorageSync('userInfo');
    if(userInfo){
      this.setData({
        userInfo,
      })
    }else{
      this.setData({
        userInfo:'',
        //visible:false,
      })
    }
  },
  //选择学校
  selectSchool(e){
    let index = e.detail.value;
    switch(e.detail.column){
      case 0: 
        app.wxGet('city', {
          'alpha':this.data.schoolList[0][index]
          }, (data)=>{
          let newData = [];
          for(let index in data){
            newData[index] = data[index].name;
          }
          let tempKey = 'schoolList[1]';
          this.setData({
            [tempKey]: newData,
          })
        },(err)=>{
          console.error(err);
        })
        break;
      case 1:
        app.wxGet('school',{
          'city':this.data.schoolList[1][index]
          },(data)=>{
            let newData = [];
            for (let index in data) {
              newData[index] = data[index].name;
            }
            let tempKey = 'schoolList[2]';
            this.setData({
              [tempKey]: newData,
            })
            setTimeout(()=>{
              this.setData({
                schoolName: this.data.schoolList[2][0]
              })
              wx.setStorage({
                key: 'school',
                data: this.data.schoolName,
              })
            },200);
          },(err)=>{
            console.error(err);
        })
        break;
      case 2:
        this.setData({
          schoolName: this.data.schoolList[2][index],
        })
        wx.setStorage({
          key: 'school',
          data: this.data.schoolName,
        })
        break;
      default: break;
    }
  },
  //搜索商品
  bindValueChange(e){
    this.setData({
      itemName: e.detail.value
    })
  },
  searchItem(e){
    if (this.data.schoolName === '选择学校'){
      $Toast({
        type:"warning",
        content:"请先选择学校"
      })
      return false;
    }
    if(this.data.itemName === ''){
      return false;
    }
    wx.navigateTo({
      url: `/pages/search/search?size=${this.data.size}&keyword=${this.data.itemName}`,
    });
  },
  //切换分类
  changeTab({detail}){
    if (this.data.currentTab !== detail.key){
      this.setData({currentPage:1,totalPage:0})
    }
    this.setData({
      currentTab: detail.key
    })
    if (this.data.schoolName === '选择学校') {
      $Toast({
        type: "warning",
        content: "请先选择学校"
      })
      return false;
    }
    let tempObj={
      school: this.data.schoolName,
      page: this.data.currentPage,
      size: this.data.size,
    }
    if (this.data.currentTab !== '最新'){
      tempObj.cate = this.data.currentTab;
    }
    app.wxGet('category',tempObj,(res)=>{
      if(res.err){
        this.setData({
          itemList: '',
          itemNum: 0
        })
        return false;
      }
      this.setData({
        itemList: JSON.stringify(res.data),
        itemNum: res.count,
        totalPage: Math.ceil(res.count / tempObj.size)
      })
    },(err)=>{
      console.error(err);
    })
  },
  //首页信息 是否登陆
  clickOnline(){
    this.setData({
      visible: true
    })
  },
  clickOffline(){
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  openActionSheet({detail}){
    let index = detail.index;
    if(index === 0){
      wx.removeStorageSync('userInfo');
      wx.removeStorageSync('token');
      this.setData({
        userInfo: '',
        visible: false,
      });
    }
  },
  closeActionSheet(){
    this.setData({
      visible: false
    })
  },
  // 分页
  clickPage({detail}){
    const type = detail.type;
    if (type === 'next') {
      this.setData({
        currentPage: this.data.currentPage + 1
      });
      this.changeTab({detail:{key:this.data.currentTab}});
    } else if (type === 'prev') {
      this.setData({
        currentPage: this.data.currentPage - 1
      });
      this.changeTab({ detail: { key: this.data.currentTab } });
    }
  }
})
