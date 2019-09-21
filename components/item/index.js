const app = getApp();

Component({
  externalClasses: 'z-class',
  //传入一个item-list-str属性, 得到一个商品列表
  //微信属性传数组和对象有bug...
  properties: {
    itemListStr: String
  },
  //私有数据
  data: {
    itemList: [],
    imgList: [],
    timeList: []
  },
  methods:{
    //根据传入的物品列表字符串来更改itemList
    getImgList(){
      let imgList = [];
      for (let item of this.data.itemList) {
        let imgUrl = JSON.parse(item.pic)[0];
        if (imgUrl) {
          imgList.push(`${app.appData.baseUrl}uploads/${imgUrl}`);
        } else {
          imgList.push(`${app.appData.baseUrl}assets/none_img.png`);
        }
      }
      this.setData({
        imgList
      })
    },
    //设置发布时间
    setTime(){
      let timeList = [];
      for (let item of this.data.itemList){
        let publish_at = app.time2string(item.create_time);
        timeList.push(publish_at);
      }
      this.setData({
        timeList
      });
    },
    //跳转详情页
    navigateToDetail(e){
      let itemId = e.currentTarget.dataset.itemId;
      wx.navigateTo({
        url: `/pages/detail/detail?item=${itemId}`,
      })
    }
  },
  //一旦请求导致itemListStr变化, 就更新子组件数据
  observers: {
    "itemListStr": function (itemListStr){
      this.setData({
        itemList: JSON.parse(this.data.itemListStr)
      });
      this.getImgList();
      this.setTime();
    }
  },
})