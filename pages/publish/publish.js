// pages/publish/publish.js
const app = getApp();
const { $Toast } = require('../../ivu/base/index');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList:[],
    deleteImgIndex: undefined,
    cate:['电瓶车','自行车','书籍','艺术品','其他'],
    modalVisible: false,
    upload:{
      title:'',
      desc:'',
      price:undefined,
      old_price:undefined,
      cate:0,
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  //选择图片
  selectImage(){
    if (!app.checkLogin()) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return false;
    };
    if(this.data.imgList.length < 5){
      wx.chooseImage({
        count: 5,
        sizeType: ['compressed'],
        success: (res) => {
          for (let item of res.tempFiles){
            let imgList = this.data.imgList;
            if(imgList.length < 5){
              this.setData({
                imgList: imgList.concat(item)
              })
            }else{
              return false;
            }
          }
        },
      })
    }else{
      $Toast({type:'error',content:'最多上传5张图片'});
    }
  },

  //删除确认
  deleteImg(e){
    this.setData({
      modalVisible: true,
      deleteImgIndex: e.currentTarget.dataset.index,
    });
  },
  //删除取消
  cancelDelete(){
    this.setData({
      modalVisible: false,
      deleteImgIndex: undefined,
    })
  },
  //删除图片
  handleDeleteImg(){
    let imgList = this.data.imgList;
    imgList.splice(this.data.deleteImgIndex, 1);
    this.setData({
      imgList,
      deleteImgIndex: undefined,
      modalVisible: false,
    });
  },

  //同步标题
  titleSync({detail}){
    this.setData({
      'upload.title': detail.value,
    });
  },

  //同步描述
  descSync({detail}){
    this.setData({
      'upload.desc': detail.value,
    });
  },
  //同步分类
  cateSync({detail}){
    this.setData({
      'upload.cate': detail.value,
    })
  },
  //同步价格
  priceSync({detail}){
    this.setData({
      'upload.price': detail.value,
    });
  },
  //同步原价
  oldPriceSync({detail}){
    this.setData({
      'upload.old_price': detail.value,
    });
  },
  //检查输入合法性
  checkInput(){
    let title = this.data.upload.title;
    let desc = this.data.upload.desc;
    let cate = this.data.upload.cate;
    let price = this.data.upload.price;
    let oldPrice = this.data.upload.old_price;
    let titleReg = /^.{4,30}$/i;
    let descReg = /^.{10,1000}$/i;

    if(this.data.imgList.length < 1){
      $Toast({ type: 'error', content: '至少上传1张图' }); return false;
    }
    if(title.search(titleReg) === -1){
      $Toast({type:'error', content:'标题4-30个字'});return false;
    }
    if(desc.search(descReg) === -1){
      $Toast({ type: 'error', content: '描述最少10个字' }); return false;
    }
    if (cate < 0 || cate > 4) {
      $Toast({ type: 'error', content: '请不要乱改!' }); return false;
    }
    if(!price){
      $Toast({type: 'error', content: '价格必填'});return false;
    }
    if (price < 0 || price >= 10000) {
      $Toast({ type: 'error', content: '价格不能超出范围' }); return false;
    }
    if (!oldPrice) {
      $Toast({ type: 'error', content: '原价必填' }); return false;
    }
    if (oldPrice < 0 || oldPrice >= 10000) {
      $Toast({ type: 'error', content: '原价不能超出范围' }); return false;
    }
    if (oldPrice < price) {
      $Toast({ type: 'error', content: '原价必须比价格高' }); return false;
    }
    return true;
  },
  //发布
  publish(){
    const userInfo = wx.getStorageSync('userInfo');
    const school = wx.getStorageSync('school');
    if(!school){
      $Toast({type:'error', content: '请回首页选择学校!'});
      return false;
    }
    if (!app.checkLogin()) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return false;
    };
    if(this.checkInput()){
      $Toast({ type: "loading", duration: 0, content:'上传中...'});
      let imgList = this.data.imgList;
      let imgCount = imgList.length;
      let serverImgList = [];
      //上传图片  此处有异步问题!!!
      for(let img of imgList){
        app.wxUpload('upload',img.path,(data) => {
          serverImgList.push(data.path);
        },()=>{
          console.error('上传发生错误');
        })
      }
      //准备上传数据
      let th = setInterval(()=>{
        if (imgCount === serverImgList.length){
          let obj = {};
          let upload = this.data.upload;
          obj.user_id = userInfo.id;
          obj.cate = this.data.cate[upload.cate];
          obj.school = school;
          obj.title = upload.title;
          obj.desc = upload.desc;
          obj.price = upload.price;
          obj.oldPrice = upload.old_price;
          obj.pic = JSON.stringify(serverImgList);
          app.wxPost('publish', obj, (data) => {
            wx.reLaunch({
              url: `/pages/detail/detail?item=${data.id}`,
            });
            $Toast.hide();
          }, () => {
            console.error('发生未知错误');
          })
          clearInterval(th);
        }
      },50);
    }
  },
})