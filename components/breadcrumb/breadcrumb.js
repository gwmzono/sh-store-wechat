// components/breadcrumb/breadcrumb.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    separator:{
      type:String,
      data:'/'
    },
    //[name:'面包屑名称',to:'目标地址']
    breadList:{
      type:Array,
      data:[]
    },
    //当前页显示内容
    current:{
      type:String,
      data:''
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickBreadcrumb(e){
      let to = e.currentTarget.dataset.to;
      wx.reLaunch({
        url: `/pages/${to}/${to}`,
      })
    }
  },
})
