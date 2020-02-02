// pages/search/search.js
const app = getApp();
const { $Toast } = require('../../ivu/base/index');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentPage:1,
    totalPage:0,
    size:4,
    keyword:'',
    school:wx.getStorageSync('school'),
    itemList: '[]',
    breadList:[
      {name:'首页', to:'index'}
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      size: options.size,
      keyword: options.keyword,
    });
    this.searchItem();
  },

  //搜索商品
  searchItem(){
    app.wxGet('search', {
      school: this.data.school,
      keyword: this.data.keyword,
      page: this.data.currentPage,
      size: this.data.size,
    }, (res) => {
      if (res.err) {
        console.warn(res.err);
        $Toast({ type: 'error', content: res.err });
        this.setData({
          itemList: '',
        })
        return false;
      }
      this.setData({
        itemList: JSON.stringify(res.data),
        totalPage: Math.ceil(res.total / this.data.size),
      })
    }, (err) => {
      console.error(err);
    })
  },

  //点击分页事件
  clickPage({ detail }) {
    const type = detail.type;
    if (type === 'next') {
      this.setData({
        currentPage: this.data.currentPage + 1
      });
      this.searchItem();
    } else if (type === 'prev') {
      this.setData({
        currentPage: this.data.currentPage - 1
      });
      this.searchItem();
    }
  }
})